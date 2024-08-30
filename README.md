# 🦢 SQAN Stack with 3rd Party login

## It uses the MS**SQ**l, **A**ngular, and .**N**et core stack to get you started.

*This is a distant cousin of [QuickApp](https://github.com/emonney/QuickApp) by Eben Money.*

*The idea is you can pull it, run it in a docker stack and get started quick! 😉*

---

## Ready to use

Just pull it down from git and run 👨‍💻

docker-compose -f docker-compose.dev.yml up

## The app has google auth out of the box, but you will need to supply your google auth client id and secret.

The files you need to update are:
appsettings.json:

"Authentication": {
  "Google": {
    "ClientId": "{{your client id}}",
    "ClientSecret": ""
  }
},

and app.module.ts:

providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '{{your client id}}', {
              scopes: 'email',
              // plugin_name: 'the name of the Google OAuth project you created'
            }
            )
          },
        ],

## Support

If you need any help, please reach out to me at [jon@tekonline.com.au](mailto:jon@tekonline.com.au), or head over to [www.tekonline.com.au](http://www.tekonline.com.au)
