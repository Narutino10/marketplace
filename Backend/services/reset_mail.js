// services/passwordRenewalService.js

const User = require('../models/postgres_models/UserPg');
const {sendEmail} = require('./mailer');

async function checkPasswordRenewal() {
    try {
        const users = await User.findAll();

        const currentDate = new Date();
        const resetPasswordBaseUrl = 'http://localhost:5173/reset-password/';

        for (const user of users) {
            const createdDate = new Date(user.account_created_at);
            const passwordUpdatedDate = new Date(user.password_last_changed);

            const sixtyDaysInMillis = 60 * 24 * 60 * 60 * 1000;

            // Vérification pour l'envoi d'e-mail de réinitialisation basé 60 jours après la création ou la modification

            if (currentDate - createdDate >= sixtyDaysInMillis) {
                const resetToken = user.reset_token;
                const resetUrl = resetPasswordBaseUrl + resetToken;
                const htmlContent = `
                    <!DOCTYPE html>
                    <html lang="fr">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Réinitialisation de mot de passe</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                line-height: 1.6;
                                background-color: #f4f4f4;
                                margin: 0;
                                padding: 0;
                            }
                            .container {
                                max-width: 600px;
                                margin: 20px auto;
                                padding: 20px;
                                background-color: #fff;
                                border-radius: 5px;
                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                            }
                            .logo {
                                text-align: center;
                                margin-bottom: 20px;
                            }
                            .logo img {
                                width: 100px;
                                height: auto;
                            }
                            .email-content {
                                padding: 20px;
                            }
                            .button {
                                display: inline-block;
                                background-color: #007bff;
                                color: #fff;
                                text-decoration: none;
                                padding: 10px 20px;
                                border-radius: 5px;
                                margin-top: 20px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="logo">
                                <img src="../../assets/logoMammbaLogo.svg" alt="Logo">
                            <div class="email-content">
                                <h2>Bonjour ${user.firstname},</h2>
                                <p>Vous recevez cet e-mail car nous avons reçu une demande de réinitialisation de votre mot de passe.</p>
                                <p>Pour procéder à la réinitialisation, veuillez cliquer sur le bouton ci-dessous :</p>
                                <a href="${resetUrl}" class="button">Réinitialiser le mot de passe</a>
                                <p>Si vous n'avez pas demandé de réinitialisation de mot de passe, vous pouvez ignorer cet e-mail en toute sécurité.</p>
                                <p>Cordialement,<br>L'équipe MambaFit</p>
                            </div>
                        </div>
                    </body>
                    </html>
                `;
                await sendEmail(user.email, 'Réinitialisation de votre mot de passe', htmlContent);
            }

            // Condition pour le cas où le mot de passe a été modifié il y a plus de 60 jours
            if (currentDate - passwordUpdatedDate >= sixtyDaysInMillis) {
                const resetToken = user.reset_token;
                const resetUrl = resetPasswordBaseUrl + resetToken;
                const htmlContent = `
                    <!DOCTYPE html>
                    <html lang="fr">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Réinitialisation de mot de passe</title>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                line-height: 1.6;
                                background-color: #f4f4f4;
                                margin: 0;
                                padding: 0;
                            }
                            .container {
                                max-width: 600px;
                                margin: 20px auto;
                                padding: 20px;
                                background-color: #fff;
                                border-radius: 5px;
                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                            }
                            .logo {
                                text-align: center;
                                margin-bottom: 20px;
                            }
                            .logo img {
                                width: 100px;
                                height: auto;
                            }
                            .email-content {
                                padding: 20px;
                            }
                            .button {
                                display: inline-block;
                                background-color: #007bff;
                                color: #fff;
                                text-decoration: none;
                                padding: 10px 20px;
                                border-radius: 5px;
                                margin-top: 20px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="logo">
                                <img src="../../assets/logoMammbaLogo.svg" alt="Logo">
                            </div>
                            <div class="email-content">
                                <h2>Bonjour ${user.firstname},</h2>
                                <p>Votre mot de passe a été modifié il y a plus de 60 jours.</p>
                                <p>Pour des raisons de sécurité, nous vous recommandons de le réinitialiser maintenant :</p>
                                <a href="${resetUrl}" class="button">Réinitialiser le mot de passe</a>
                                <p>Si vous n'avez pas modifié votre mot de passe récemment, veuillez ignorer cet e-mail.</p>
                                <p>Cordialement,<br>MambaFit</p>
                            </div>
                        </div>
                    </body>
                    </html>
                `;
                await sendEmail(user.email, 'Réinitialisation recommandée de votre mot de passe', htmlContent);
            }
        }
    } catch (error) {
        console.error('Erreur lors de la vérification du renouvellement du mot de passe :', error);
    }
}

module.exports = { checkPasswordRenewal };
