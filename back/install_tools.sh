#!/bin/bash

echo "Running $0"
INGRESS_IP=$(kubectl get services --namespace k8s-project|grep k8s-project-ingress-nginx-ingress-controller|awk '{print $4}')

while [[ $# -gt 0 ]]
do
key="$1"

case $key in
    gitbucket)
    echo "Installing gitbucket"
    helm repo add dmartinlozano https://dmartinlozano.github.io/helm-charts/
    helm repo update

cat <<-EOF | kubectl apply -f -
apiVersion: v1
kind: ConfigMap
metadata:
  name: gitbucket-conf
  namespace: k8s-project
data:
  gitbucket.conf: |
    oidc.client_secret=gitbucket
    oidc.issuer=http\://$INGRESS_IP/auth/realms/master
    oidc_authentication=true
    oidc.client_id=gitbucket
    oidc.jws_algorithm=RS256
    base_url=http\://$INGRESS_IP/gitbucket
EOF

    helm install dmartinlozano/gitbucket --name gitbucket --namespace k8s-project --set image.tag=4.32.0 --set gitbucket.base_url="http://$INGRESS_IP/gitbucket" --set configFromSecret=true
    kubectl apply -f ./ingress/gitbucket.yml
    shift
    ;;
    *)
    echo "Ignoring $key"
    shift
    ;;
esac
done

