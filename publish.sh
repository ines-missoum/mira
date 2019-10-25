rm index.zip
zip -X -r index.zip .
aws lambda update-function-code --function-name alexalambda --zip-file fileb://index.zip