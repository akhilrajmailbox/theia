#!/bin/bash
mkdir /home/theia
cd /home/theia

apt-get update
apt-get install -y curl apt-transport-https
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
apt-get update && apt-get install -y yarn

cat <<EOF > ./package.json
{
    "private": true,
    "dependencies": {
        "@theia/typescript": "latest",
        "@theia/navigator": "latest",
        "@theia/terminal": "latest",
        "@theia/outline-view": "latest",
        "@theia/preferences": "latest",
        "@theia/git": "latest",
        "@theia/file-search": "latest",
        "@theia/markers": "latest"
    },
    "devDependencies": {
        "@theia/cli": "latest"
    }
}
EOF


mkdir ~/.theia
cat <<EOF > ~/.theia/settings.json
{
    "editor.autoSave":"off"
}
EOF


yarn --cache-folder ./ycache && rm -rf ./ycache
yarn theia build
nohup yarn theia start /projects --hostname=0.0.0.0 > /home/theia/theia.out &

