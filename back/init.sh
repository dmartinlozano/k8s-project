#!/bin/bash
echo "Checking initial configuration"

#Check if directory work exists
test ! -d "$HOME/.k8s-project" && mkdir -p "$HOME/.k8s-project"
test ! -d "$HOME/.k8s-project/tools" && mkdir -p "$HOME/.k8s-project/tools"

#Check if helm tool exists
if test ! -f "$HOME/.k8s-project/tools/helm"; then
    curl -o $HOME/.k8s-project/tools/helm.tar.gz "https://get.helm.sh/helm-v2.14.2-linux-amd64.tar.gz"
    cd $HOME/.k8s-project/tools
    tar zxf helm.tar.gz --strip-components=1 linux-amd64/helm
    rm -rf *.tar.gz
    chmod +x $HOME/.k8s-project/tools/helm
fi

#Check if kubectl exists
if test ! -f "$HOME/.k8s-project/tools/kubectl"; then
    curl -o $HOME/.k8s-project/tools/kubectl "https://storage.googleapis.com/kubernetes-release/release/v1.15.1/bin/linux/amd64/kubectl"
    chmod +x $HOME/.k8s-project/tools/kubectl
fi

export PATH=$PATH:$HOME/.k8s-project/tools/

#Check if .kube/config exists
if test ! -f "$HOME/.kube/config"; then
    exit 1
fi

#Check if k8s is running
kubectl cluster-info
if test `echo $?` -ne 0; then
    exit 2
fi

kubectl create namespace k8s-project || true

#Configure tiller
kubectl --namespace kube-system create sa tiller || true
kubectl create clusterrolebinding tiller --clusterrole cluster-admin --serviceaccount=kube-system:tiller || true

#Install helm
IS_MINIKUBE=$(kubectl config view -o jsonpath='{.users[?(@.name == "minikube")].name}')
if test `$IS_MINIKUBE`

if test -z "$IS_MINIKUBE";then
    #k8s
    helm init --upgrade --wait --service-account tiller
else
    #minikube
    helm init --service-account tiller --output yaml | sed 's@apiVersion: extensions/v1beta1@apiVersion: apps/v1@' | sed 's@  replicas: 1@  replicas: 1\n  selector: {"matchLabels": {"app": "helm", "name": "tiller"}}@' | kubectl apply -f -
fi

#Check root-password
kubectl get secret k8s-project --namespace k8s-project
if test `echo $?` -ne 0
then
    ROOT_PASSWORD=$(date +%s | sha256sum | base64 | head -c 32)
    kubectl create secret generic k8s-project --namespace k8s-project --from-literal=root-password='$ROOT_PASSWORD'
fi

#Install custom ingress
if test -z "$IS_MINIKUBE";then
    #k8s
    helm install --name k8s-project-ingress stable/nginx-ingress --namespace k8s-project --set controller.ingressClass="k8s-project-ingress" ||true
else
    #minikube
    minikube addons enable ingress
fi

#Install keycloak
ROOT_PASSWORD=$(kubectl get secret k8s-project --namespace k8s-project -o json|jq '.data["root-password"]'|sed 's/\"//g'|base64 -d)
helm install stable/keycloak --name keycloak --namespace k8s-project --set keycloak.username=root --set keycloak.password="$ROOT_PASSWORD" ||true


echo "Done initial configuration"