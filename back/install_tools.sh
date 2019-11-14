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

    jenkins)
    echo "Installing jenkins"

cat > /tmp/jenkins_helm_values.yml << EOF
master:
  useSecurity: true
  overwritePlugins: true
  installPlugins:
    - git:latest
    - keycloak:latest
    - matrix-auth:latest
  csrf:
    DefaultCrumbIssuer:
      Enabled: true
      ProxyCompatability: true
  JCasC:
    enabled: true
    pluginVersion: "1.32"
    configScripts:
      ldap-settings: |
        jenkins:
          securityRealm: keycloak
        unclassified:
          keycloakSecurityRealm:
            keycloakJson: |
              {
                "realm": "master",
                "auth-server-url": "http://$INGRESS_IP/auth",
                "ssl-required": "external",
                "resource": "jenkins",
                "credentials": {
                  "secret": "jenkins"
                },
                "confidential-port": 0
              }
EOF
    helm repo update
    helm install --name k8s-project-jenkins stable/jenkins --namespace k8s-project --set master.jenkinsUriPrefix="/jenkins" --set master.adminUser=root --set master.adminPassword=root -f /tmp/jenkins_helm_values.yml
    kubectl apply -f ./ingress/jenkins.yml
    shift
    ;;

    *)
    echo "Ignoring $key"
    shift
    ;;
esac
done

