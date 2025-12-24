FROM node:18

WORKDIR /app

# ติดตั้ง netcat (ใช้ netcat-openbsd แทน)
RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

COPY wait-for-it.sh /wait-for-it.sh
RUN chmod +x /wait-for-it.sh

EXPOSE 5000

ENTRYPOINT ["/wait-for-it.sh", "db:3306", "--", "npm", "start"]
