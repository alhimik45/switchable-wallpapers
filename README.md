Switchable wallpapers (by timeout or shortcut).
Application is controlled by named pipe.

Usage example:

```bash
node switchable-wp.js  /path/to/images  /path/to/named/pipe   switch_timeout(in minutes)
```

Write something to pipe to initiate wallpaper switching:

```bash
echo next > /path/to/named/pipe
```

##License
This software is licensed under the [MIT license](LICENSE).
