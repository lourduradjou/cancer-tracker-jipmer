import type { NextConfig } from "next";
/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
	dest: 'public',
	disable: process.env.NODE_ENV === 'development', // Enable PWA only in production
})
const nextConfig: NextConfig = {
  /* config options here */
};

module.exports = withPWA(nextConfig)
export default nextConfig;
