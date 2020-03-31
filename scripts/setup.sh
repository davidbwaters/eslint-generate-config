##
##  Setup
##

# Download the parts we need from the latest ESLint repo
git init vendor
cd vendor
git remote add origin https://github.com/eslint/eslint.git
git config core.sparsecheckout true
echo 'package.json' >> .git/info/sparse-checkout
echo 'lib/rules/*' >> .git/info/sparse-checkout
echo 'lib/shared/*' >> .git/info/sparse-checkout
echo 'conf/*' >> .git/info/sparse-checkout
git pull --depth=1 origin master



