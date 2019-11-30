#!/bin/bash

snap install microk8s --classic
microk8s.status --wait-ready

IP_ADDR="$(ip -o route get to 8.8.8.8 | sed -n 's/.*src \([0-9.]\+\).*/\1/p')"
REG=$(echo $IP_ADDR|cut -d "." -f1-3)
microk8s.enable helm dns storage dashboard registry
echo $REG.1-$REG.50|microk8s.enable metallb

microk8s.kubectl config view --raw > $HOME/.kube/config