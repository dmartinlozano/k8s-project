#!/bin/bash

#Check if directory work exists
test ! -d "$HOME/.k8s-project" && mkdir -p "$HOME/.k8s-project"
test ! -d "$HOME/.k8s-project/tools" && mkdir -p "$HOME/.k8s-project/tools"


if [[ "$OSTYPE" == "linux-gnu" ]]; then

    #Check if helm tool exists
    if test ! -f "$HOME/.k8s-project/tools/helm"; then
        curl -o $HOME/.k8s-project/tools/helm.tar.gz "https://get.helm.sh/helm-v3.2.0-linux-amd64.tar.gz"
        cd $HOME/.k8s-project/tools
        tar zxf helm.tar.gz --strip-components=1 linux-amd64/helm
        rm -rf *.tar.gz
        chmod +x $HOME/.k8s-project/tools/helm
    fi

    #Check if kubectl exists
    if test ! -f "$HOME/.k8s-project/tools/kubectl"; then
        curl -o $HOME/.k8s-project/tools/kubectl "https://storage.googleapis.com/kubernetes-release/release/v1.18.2/bin/linux/amd64/kubectl"
        chmod +x $HOME/.k8s-project/tools/kubectl
    fi
    export PATH=$PATH:$HOME/.k8s-project/tools/

elif [[ "$OSTYPE" == "darwin"* ]]; then

    HELM=$(brew list|grep helm|wc -l)
    KUBERNETES=$(brew list|grep kubernetes-cli|wc -l)

    if test `echo $HELM` -eq 0; then
        brew install helm
    fi

    if test `echo $KUBERNETES` -eq 0; then
        brew install kubernetes-cli
    fi
    
elif [[ "$OSTYPE" == "win32" ]]; then
    echo "soon...";
else
    exit 4
fi

#Check if .kube/config exists
if test ! -f "$HOME/.kube/config"; then
    exit 1
fi

#Check if k8s is running
kubectl cluster-info
if test `echo $?` -ne 0; then
    exit 2
fi

kubectl create namespace k8s-project

#Install custom ingress if not microk8s
INGRESS_MICRO_K8S=$(kubectl -n ingress get pods|grep nginx-ingress-microk8s-controller|wc -l)
if test `echo $INGRESS_MICRO_K8S` -eq 0; then
    helm repo add stable https://kubernetes-charts.storage.googleapis.com/
    helm repo update
    helm install k8s-project-ingress stable/nginx-ingress --namespace k8s-project --set controller.ingressClass="k8s-project-ingress"
    INGRESS_IP=$(kubectl get services --namespace k8s-project|grep k8s-project-ingress-nginx-ingress-controller|awk '{print $4}')
else
    if [[ "$OSTYPE" == "darwin"* ]]; then
        INGRESS_IP=$(multipass info microk8s-vm | grep IPv4 | awk '{ print $2 }') 
    else
        INGRESS_IP=127.0.0.1
    fi
    echo "Ingress already installed with microk8s"
fi

#store ingressIp
kubectl delete --namespace k8s-project configmap k8s-project-config
kubectl create configmap k8s-project-config --namespace k8s-project --from-literal=INGRESS_IP=$INGRESS_IP

#cert-manager for ingress
#kubectl apply --validate=false -f https://github.com/jetstack/cert-manager/releases/download/v0.14.3/cert-manager.crds.yaml
#helm repo add jetstack https://charts.jetstack.io
#helm repo update
#helm install k8s-project-cert-manager jetstack/cert-manager --namespace k8s-project
#kubectl apply -f ./cert-manager.yml

#Install postgresql
POSTGRES_INSTALLED=$(helm ls --namespace k8s-project|grep k8s-project-postgresql|wc -l)
if test $POSTGRES_INSTALLED -eq 0
then
    echo "Installing postgresql"
    helm repo add bitnami https://charts.bitnami.com/bitnami
    helm install --wait k8s-project-postgresql bitnami/postgresql --namespace k8s-project --set postgresqlUsername=k8sproject --set postgresqlDatabase=k8sproject --set initdbScripts."init\.sql"="CREATE DATABASE keycloak;GRANT ALL PRIVILEGES ON DATABASE keycloak TO k8sproject;CREATE DATABASE gitbucket;GRANT ALL PRIVILEGES ON DATABASE gitbucket TO k8sproject;CREATE DATABASE wiki;GRANT ALL PRIVILEGES ON DATABASE wiki TO k8sproject;"
fi

KEYCLOAK_INSTALLED=$(helm ls --namespace k8s-project|grep k8s-project-keycloak|wc -l)
if test $KEYCLOAK_INSTALLED -eq 0
then
    echo "Keycloak is not installed. Signup!"
    exit 3
fi

exit 0