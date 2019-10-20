Get password:
```
kubectl get secret --namespace k8s-project keycloak-http -o jsonpath="{.data.password}" | base64 --decode; echo
```