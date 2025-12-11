import { ApiPublic } from '@/decorators/http.decorators';
import { Public } from '@/decorators/public.decorator';
import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class HomeController {
  @Get()
  @Public()
  @ApiPublic({ summary: 'Home' })
  home() {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>Welcome to the API</title>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@700&display=swap" rel="stylesheet">
      <style>
        body {
          min-height: 100vh;
          margin: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
          font-family: 'Montserrat', Arial, sans-serif;
        }
        .container {
          background: rgba(255,255,255,0.07);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
          border-radius: 20px;
          padding: 48px 40px;
          text-align: center;
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255,255,255,0.18);
        }
        h1 {
          font-size: 2.8rem;
          color: #fff;
          margin-bottom: 0.5em;
          letter-spacing: 2px;
          text-shadow: 0 2px 16px rgba(30,60,114,0.3);
        }
        p {
          color: #e0e0e0;
          font-size: 1.2rem;
          margin-bottom: 1.5em;
        }
        .api-link {
          display: inline-block;
          padding: 12px 32px;
          background: linear-gradient(90deg, #ff8c00 0%, #ff0080 100%);
          background-size: 200% 100%;
          background-position: left;
          color: #fff;
          border-radius: 30px;
          text-decoration: none;
          font-weight: bold;
          font-size: 1.1rem;
          box-shadow: 0 2px 8px rgba(255,140,0,0.15);
          transition: background-position 0.4s cubic-bezier(.4,0,.2,1), transform 0.2s;
        }
        .api-link:hover {
          background-position: right;
          transform: translateY(-2px) scale(1.04);
        }
        @media (max-width: 600px) {
          .container {
            padding: 24px 10px;
          }
          h1 {
            font-size: 2rem;
          }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 Welcome to the API</h1>
        <p>Your backend is running and ready to serve!</p>
        <a class="api-link" href="/api-docs" target="_blank">View API Docs</a>
      </div>
    </body>
    </html>
  `;
  }
}
