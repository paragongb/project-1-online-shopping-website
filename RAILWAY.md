# Railway setup for this project

This project uses one Railway app service plus one Railway MySQL service. The `Dockerfile` builds the storefront and Java app together, so the frontend does **not** need separate hosting.

1. Push this project to your GitHub repository. Do not commit passwords, JWT secrets, or `.env` files.
2. In Railway, create a project from that GitHub repository. Railway should detect the root `Dockerfile` for the app service.
3. Add a **MySQL** service to the same Railway project.
4. On the app service, open **Variables** and add the following. If your database service is not named `MySQL`, replace `MySQL` in the references with its actual service name.

   | Variable                     | Value                                                                                                                                                              |
   | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
   | `SPRING_PROFILES_ACTIVE`     | `prod`                                                                                                                                                             |
   | `SPRING_DATASOURCE_URL`      | `jdbc:mysql://${{MySQL.MYSQLHOST}}:${{MySQL.MYSQLPORT}}/${{MySQL.MYSQLDATABASE}}?useUnicode=true&characterEncoding=utf8&useSSL=false&allowPublicKeyRetrieval=true` |
   | `SPRING_DATASOURCE_USERNAME` | `${{MySQL.MYSQLUSER}}`                                                                                                                                             |
   | `SPRING_DATASOURCE_PASSWORD` | `${{MySQL.MYSQLPASSWORD}}`                                                                                                                                         |
   | `JWT_BASE64_SECRET`          | A unique, private Base64 secret (see below)                                                                                                                        |
   | `STORE_WHATSAPP_NUMBER`      | Your WhatsApp number with country code, digits only                                                                                                                |

5. In the app service's **Networking** settings, generate a public domain. Then add `PUBLIC_BASE_URL` to the app variables, with your full `https://` domain and no trailing slash (for example, `https://your-app.up.railway.app`). Redeploy after changing variables.
6. Set the app service healthcheck path to `/management/health`. Do not set a custom start command or fixed port; the app reads Railway's `PORT` automatically.
7. Open the site, test a sign-in and an order, and change any default JHipster administrator password before sharing the site.

To generate `JWT_BASE64_SECRET` on Windows PowerShell, run:

```powershell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(64))
```

Copy the result into Railway **Variables**, not into a project file. Keep the same value for future redeploys, or existing sessions will be invalidated.

**Important:** Registration and password-reset emails still use SMTP in this project. Railway's Free, Trial, and Hobby plans do not allow outbound SMTP, so those emails will not work until the app is changed to use an HTTPS email API. This setup does not make that code change. A new Railway MySQL service starts empty; it does not import your local products or customer data. Back up and migrate data separately if needed. Check Railway's current plan limits before relying on the service as permanently free.
