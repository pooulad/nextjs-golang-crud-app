FROM focker.ir/node:lts-alpine

# تنظیم دایرکتوری کاری
WORKDIR /app

# کپی فایل‌های پکیج قبل از بقیه فایل‌ها برای بهینه‌سازی کش
COPY package.json yarn.lock ./

# نصب وابستگی‌ها
RUN yarn install

# کپی فایل env
COPY .env .env

# کپی باقی فایل‌ها
COPY . .

# ساخت پروژه
RUN yarn build

# تنظیم پورت
EXPOSE 3000

# اجرای پروژه
CMD ["yarn", "start"]
