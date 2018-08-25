
rd .\remote-assets\ /s /q
xcopy .\build\jsb-default\src .\remote-assets\src\ /E
xcopy .\build\jsb-default\res .\remote-assets\res\ /E

node version_generator.js -v 1.0.0.0 -u http://58.210.237.50:60080/fish/ -s ./remote-assets -d ./remote-assets

copy .\remote-assets\project.manifest .\build\jsb-default\res\raw-assets\resources\project.manifest
copy .\remote-assets\project.manifest .\remote-assets\res\raw-assets\resources\project.manifest
pause