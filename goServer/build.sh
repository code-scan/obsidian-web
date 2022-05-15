go build -ldflags "-s -w" -o ../bin/web_linux_amd64 .
GOOS=windows go build -ldflags "-s -w" -o ../bin/web_windows_amd64.exe .
upx -9 ../bin/*
