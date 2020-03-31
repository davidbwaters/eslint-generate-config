##
##  Clean
##

# Clean the workspace
# Input folder contents won't be deleted

# Remove and recreate the 'output' folder
[ -d 'output' ] && rm -R 'output'
mkdir 'output'

# If 'input' folder hasn't been created, create it
[ ! -d 'input' ] && mkdir input

# If 'vendor' folder exists from previous run, remove it
[ -d 'vendor' ] && chmod -R 777 'vendor' && rm -R 'vendor'

