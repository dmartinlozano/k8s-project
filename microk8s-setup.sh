#!/bin/bash

snap install microk8s --classic
microk8s.status --wait-ready

IP_ADDR="$(ip -o route get to 8.8.8.8 | sed -n 's/.*src \([0-9.]\+\).*/\1/p')"
REG=$(echo $IP_ADDR|cut -d "." -f1-3)
microk8s.enable helm dns storage dashboard registry
echo $REG.1-$REG.50|microk8s.enable metallb

microk8s.helm init --override spec.selector.matchLabels.'name'='tiller',spec.selector.matchLabels.'app'='helm' --output yaml | sed 's@apiVersion: extensions/v1beta1@apiVersion: apps/v1@' | microk8s.kubectl apply -f -
microk8s.kubectl create namespace k8s-project
microk8s.kubectl create configmap k8s-project-config --namespace k8s-project --from-literal=INGRESS_IP=127.0.0.1
microk8s.kubectl config view --raw > $HOME/.kube/config