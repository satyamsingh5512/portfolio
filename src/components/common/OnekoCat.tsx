import { catConfig } from '@/config/Cat';
import Script from 'next/script';
import React from 'react';

export default function OnekoCat() {
  if (!catConfig.enabled) {
    return null;
  }

  return <Script src="./oneko/oneko.js" data-cat="https://res.cloudinary.com/dnuxivxnu/image/upload/v1771768645/portfolio/oneko/file.gif" />;
}