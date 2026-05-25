"use client";

import { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

type CollectionStep = 'phone' | 'name' | 'course' | 'done';

const countryCodes = [
  { code: '+93', country: 'Afghanistan' },
  { code: '+355', country: 'Albania' },
  { code: '+213', country: 'Algeria' },
  { code: '+1-268', country: 'Antigua & Barbuda' },
  { code: '+54', country: 'Argentina' },
  { code: '+374', country: 'Armenia' },
  { code: '+61', country: 'Australia' },
  { code: '+43', country: 'Austria' },
  { code: '+994', country: 'Azerbaijan' },
  { code: '+1-242', country: 'Bahamas' },
  { code: '+973', country: 'Bahrain' },
  { code: '+880', country: 'Bangladesh' },
  { code: '+1-246', country: 'Barbados' },
  { code: '+375', country: 'Belarus' },
  { code: '+32', country: 'Belgium' },
  { code: '+501', country: 'Belize' },
  { code: '+229', country: 'Benin' },
  { code: '+975', country: 'Bhutan' },
  { code: '+591', country: 'Bolivia' },
  { code: '+387', country: 'Bosnia & Herzegovina' },
  { code: '+267', country: 'Botswana' },
  { code: '+55', country: 'Brazil' },
  { code: '+673', country: 'Brunei' },
  { code: '+359', country: 'Bulgaria' },
  { code: '+226', country: 'Burkina Faso' },
  { code: '+257', country: 'Burundi' },
  { code: '+855', country: 'Cambodia' },
  { code: '+237', country: 'Cameroon' },
  { code: '+1', country: 'Canada' },
  { code: '+238', country: 'Cape Verde' },
  { code: '+1-345', country: 'Cayman Islands' },
  { code: '+236', country: 'Central African Republic' },
  { code: '+235', country: 'Chad' },
  { code: '+56', country: 'Chile' },
  { code: '+86', country: 'China' },
  { code: '+57', country: 'Colombia' },
  { code: '+269', country: 'Comoros' },
  { code: '+243', country: 'Congo' },
  { code: '+682', country: 'Cook Islands' },
  { code: '+506', country: 'Costa Rica' },
  { code: '+385', country: 'Croatia' },
  { code: '+53', country: 'Cuba' },
  { code: '+357', country: 'Cyprus' },
  { code: '+420', country: 'Czech Republic' },
  { code: '+45', country: 'Denmark' },
  { code: '+253', country: 'Djibouti' },
  { code: '+1-767', country: 'Dominica' },
  { code: '+1-809', country: 'Dominican Republic' },
  { code: '+670', country: 'East Timor' },
  { code: '+593', country: 'Ecuador' },
  { code: '+20', country: 'Egypt' },
  { code: '+503', country: 'El Salvador' },
  { code: '+240', country: 'Equatorial Guinea' },
  { code: '+291', country: 'Eritrea' },
  { code: '+372', country: 'Estonia' },
  { code: '+251', country: 'Ethiopia' },
  { code: '+500', country: 'Falkland Islands' },
  { code: '+298', country: 'Faroe Islands' },
  { code: '+679', country: 'Fiji' },
  { code: '+358', country: 'Finland' },
  { code: '+33', country: 'France' },
  { code: '+241', country: 'Gabon' },
  { code: '+220', country: 'Gambia' },
  { code: '+995', country: 'Georgia' },
  { code: '+49', country: 'Germany' },
  { code: '+233', country: 'Ghana' },
  { code: '+350', country: 'Gibraltar' },
  { code: '+30', country: 'Greece' },
  { code: '+299', country: 'Greenland' },
  { code: '+1-473', country: 'Grenada' },
  { code: '+502', country: 'Guatemala' },
  { code: '+224', country: 'Guinea' },
  { code: '+245', country: 'Guinea-Bissau' },
  { code: '+592', country: 'Guyana' },
  { code: '+509', country: 'Haiti' },
  { code: '+504', country: 'Honduras' },
  { code: '+852', country: 'Hong Kong' },
  { code: '+36', country: 'Hungary' },
  { code: '+354', country: 'Iceland' },
  { code: '+91', country: 'India' },
  { code: '+62', country: 'Indonesia' },
  { code: '+98', country: 'Iran' },
  { code: '+964', country: 'Iraq' },
  { code: '+353', country: 'Ireland' },
  { code: '+972', country: 'Israel' },
  { code: '+39', country: 'Italy' },
  { code: '+225', country: 'Ivory Coast' },
  { code: '+1-876', country: 'Jamaica' },
  { code: '+81', country: 'Japan' },
  { code: '+962', country: 'Jordan' },
  { code: '+7', country: 'Kazakhstan' },
  { code: '+254', country: 'Kenya' },
  { code: '+686', country: 'Kiribati' },
  { code: '+965', country: 'Kuwait' },
  { code: '+996', country: 'Kyrgyzstan' },
  { code: '+856', country: 'Laos' },
  { code: '+371', country: 'Latvia' },
  { code: '+961', country: 'Lebanon' },
  { code: '+266', country: 'Lesotho' },
  { code: '+231', country: 'Liberia' },
  { code: '+218', country: 'Libya' },
  { code: '+423', country: 'Liechtenstein' },
  { code: '+370', country: 'Lithuania' },
  { code: '+352', country: 'Luxembourg' },
  { code: '+853', country: 'Macau' },
  { code: '+389', country: 'Macedonia' },
  { code: '+261', country: 'Madagascar' },
  { code: '+265', country: 'Malawi' },
  { code: '+60', country: 'Malaysia' },
  { code: '+960', country: 'Maldives' },
  { code: '+223', country: 'Mali' },
  { code: '+356', country: 'Malta' },
  { code: '+692', country: 'Marshall Islands' },
  { code: '+222', country: 'Mauritania' },
  { code: '+230', country: 'Mauritius' },
  { code: '+52', country: 'Mexico' },
  { code: '+691', country: 'Micronesia' },
  { code: '+373', country: 'Moldova' },
  { code: '+377', country: 'Monaco' },
  { code: '+976', country: 'Mongolia' },
  { code: '+382', country: 'Montenegro' },
  { code: '+1-664', country: 'Montserrat' },
  { code: '+212', country: 'Morocco' },
  { code: '+258', country: 'Mozambique' },
  { code: '+95', country: 'Myanmar' },
  { code: '+264', country: 'Namibia' },
  { code: '+674', country: 'Nauru' },
  { code: '+977', country: 'Nepal' },
  { code: '+31', country: 'Netherlands' },
  { code: '+599', country: 'Netherlands Antilles' },
  { code: '+64', country: 'New Zealand' },
  { code: '+505', country: 'Nicaragua' },
  { code: '+227', country: 'Niger' },
  { code: '+234', country: 'Nigeria' },
  { code: '+683', country: 'Niue' },
  { code: '+850', country: 'North Korea' },
  { code: '+47', country: 'Norway' },
  { code: '+968', country: 'Oman' },
  { code: '+92', country: 'Pakistan' },
  { code: '+680', country: 'Palau' },
  { code: '+970', country: 'Palestine' },
  { code: '+507', country: 'Panama' },
  { code: '+675', country: 'Papua New Guinea' },
  { code: '+595', country: 'Paraguay' },
  { code: '+51', country: 'Peru' },
  { code: '+63', country: 'Philippines' },
  { code: '+48', country: 'Poland' },
  { code: '+351', country: 'Portugal' },
  { code: '+1-787', country: 'Puerto Rico' },
  { code: '+974', country: 'Qatar' },
  { code: '+242', country: 'Republic of the Congo' },
  { code: '+40', country: 'Romania' },
  { code: '+7', country: 'Russia' },
  { code: '+250', country: 'Rwanda' },
  { code: '+1-869', country: 'Saint Kitts & Nevis' },
  { code: '+1-758', country: 'Saint Lucia' },
  { code: '+1-784', country: 'Saint Vincent & Grenadines' },
  { code: '+685', country: 'Samoa' },
  { code: '+378', country: 'San Marino' },
  { code: '+239', country: 'Sao Tome & Principe' },
  { code: '+966', country: 'Saudi Arabia' },
  { code: '+221', country: 'Senegal' },
  { code: '+381', country: 'Serbia' },
  { code: '+248', country: 'Seychelles' },
  { code: '+232', country: 'Sierra Leone' },
  { code: '+65', country: 'Singapore' },
  { code: '+421', country: 'Slovakia' },
  { code: '+386', country: 'Slovenia' },
  { code: '+677', country: 'Solomon Islands' },
  { code: '+252', country: 'Somalia' },
  { code: '+27', country: 'South Africa' },
  { code: '+82', country: 'South Korea' },
  { code: '+211', country: 'South Sudan' },
  { code: '+34', country: 'Spain' },
  { code: '+94', country: 'Sri Lanka' },
  { code: '+1-249', country: 'Sudan' },
  { code: '+597', country: 'Suriname' },
  { code: '+268', country: 'Swaziland' },
  { code: '+46', country: 'Sweden' },
  { code: '+41', country: 'Switzerland' },
  { code: '+963', country: 'Syria' },
  { code: '+886', country: 'Taiwan' },
  { code: '+992', country: 'Tajikistan' },
  { code: '+255', country: 'Tanzania' },
  { code: '+66', country: 'Thailand' },
  { code: '+228', country: 'Togo' },
  { code: '+690', country: 'Tokelau' },
  { code: '+676', country: 'Tonga' },
  { code: '+1-868', country: 'Trinidad & Tobago' },
  { code: '+216', country: 'Tunisia' },
  { code: '+90', country: 'Turkey' },
  { code: '+993', country: 'Turkmenistan' },
  { code: '+1-649', country: 'Turks & Caicos Islands' },
  { code: '+688', country: 'Tuvalu' },
  { code: '+1-340', country: 'U.S. Virgin Islands' },
  { code: '+1', country: 'USA' },
  { code: '+971', country: 'UAE' },
  { code: '+44', country: 'UK' },
  { code: '+380', country: 'Ukraine' },
  { code: '+256', country: 'Uganda' },
  { code: '+598', country: 'Uruguay' },
  { code: '+998', country: 'Uzbekistan' },
  { code: '+678', country: 'Vanuatu' },
  { code: '+379', country: 'Vatican City' },
  { code: '+58', country: 'Venezuela' },
  { code: '+84', country: 'Vietnam' },
  { code: '+1-284', country: 'British Virgin Islands' },
  { code: '+967', country: 'Yemen' },
  { code: '+260', country: 'Zambia' },
  { code: '+263', country: 'Zimbabwe' },
];

const courses = [
  "BBA", "BCA", "B.Com", "MBA", "MCA", 
  "B.Sc Nursing", "GNM Nursing", "Hotel Management",
  "BHM", "BVA", "BA", "M.Sc"
];

const STORAGE_KEY = 'kgi_user_data';

const countryPhoneConfig: Record<string, { minLen: number; maxLen: number; startsWith?: RegExp }> = {
  '+93': { minLen: 9, maxLen: 9 },
  '+355': { minLen: 9, maxLen: 10 },
  '+213': { minLen: 9, maxLen: 10 },
  '+1-268': { minLen: 10, maxLen: 10 },
  '+54': { minLen: 10, maxLen: 11 },
  '+374': { minLen: 8, maxLen: 8 },
  '+61': { minLen: 9, maxLen: 10 },
  '+43': { minLen: 10, maxLen: 12 },
  '+994': { minLen: 9, maxLen: 10 },
  '+1-242': { minLen: 10, maxLen: 10 },
  '+973': { minLen: 8, maxLen: 8 },
  '+880': { minLen: 10, maxLen: 10 },
  '+1-246': { minLen: 10, maxLen: 10 },
  '+375': { minLen: 9, maxLen: 9 },
  '+32': { minLen: 9, maxLen: 10 },
  '+501': { minLen: 7, maxLen: 7 },
  '+229': { minLen: 10, maxLen: 10 },
  '+975': { minLen: 8, maxLen: 8 },
  '+591': { minLen: 8, maxLen: 8 },
  '+387': { minLen: 8, maxLen: 8 },
  '+267': { minLen: 8, maxLen: 8 },
  '+55': { minLen: 10, maxLen: 11 },
  '+673': { minLen: 7, maxLen: 7 },
  '+359': { minLen: 9, maxLen: 9 },
  '+226': { minLen: 8, maxLen: 8 },
  '+257': { minLen: 8, maxLen: 8 },
  '+855': { minLen: 9, maxLen: 10 },
  '+237': { minLen: 9, maxLen: 9 },
  '+1': { minLen: 10, maxLen: 10 },
  '+238': { minLen: 7, maxLen: 7 },
  '+1-345': { minLen: 10, maxLen: 10 },
  '+236': { minLen: 8, maxLen: 8 },
  '+235': { minLen: 8, maxLen: 8 },
  '+56': { minLen: 9, maxLen: 9 },
  '+86': { minLen: 11, maxLen: 11 },
  '+57': { minLen: 10, maxLen: 10 },
  '+269': { minLen: 7, maxLen: 7 },
  '+506': { minLen: 8, maxLen: 8 },
  '+385': { minLen: 9, maxLen: 9 },
  '+53': { minLen: 8, maxLen: 8 },
  '+357': { minLen: 8, maxLen: 8 },
  '+420': { minLen: 9, maxLen: 9 },
  '+45': { minLen: 8, maxLen: 8 },
  '+253': { minLen: 8, maxLen: 8 },
  '+1-767': { minLen: 10, maxLen: 10 },
  '+1-809': { minLen: 10, maxLen: 10 },
  '+670': { minLen: 8, maxLen: 8 },
  '+593': { minLen: 9, maxLen: 10 },
  '+20': { minLen: 10, maxLen: 10 },
  '+503': { minLen: 8, maxLen: 8 },
  '+240': { minLen: 9, maxLen: 9 },
  '+291': { minLen: 7, maxLen: 7 },
  '+372': { minLen: 7, maxLen: 8 },
  '+251': { minLen: 9, maxLen: 9 },
  '+500': { minLen: 5, maxLen: 5 },
  '+679': { minLen: 7, maxLen: 7 },
  '+358': { minLen: 9, maxLen: 12 },
  '+33': { minLen: 9, maxLen: 9 },
  '+241': { minLen: 7, maxLen: 8 },
  '+220': { minLen: 7, maxLen: 7 },
  '+995': { minLen: 9, maxLen: 9 },
  '+49': { minLen: 10, maxLen: 11 },
  '+233': { minLen: 9, maxLen: 9 },
  '+350': { minLen: 8, maxLen: 8 },
  '+30': { minLen: 10, maxLen: 10 },
  '+299': { minLen: 6, maxLen: 6 },
  '+1-473': { minLen: 10, maxLen: 10 },
  '+502': { minLen: 8, maxLen: 8 },
  '+224': { minLen: 9, maxLen: 9 },
  '+245': { minLen: 7, maxLen: 7 },
  '+592': { minLen: 7, maxLen: 7 },
  '+509': { minLen: 8, maxLen: 8 },
  '+852': { minLen: 8, maxLen: 8 },
  '+36': { minLen: 9, maxLen: 9 },
  '+354': { minLen: 7, maxLen: 9 },
  '+91': { minLen: 10, maxLen: 10, startsWith: /^[6-9]/ },
  '+62': { minLen: 10, maxLen: 12 },
  '+98': { minLen: 10, maxLen: 10 },
  '+964': { minLen: 10, maxLen: 10 },
  '+353': { minLen: 9, maxLen: 10 },
  '+972': { minLen: 8, maxLen: 9 },
  '+39': { minLen: 10, maxLen: 10 },
  '+1-876': { minLen: 10, maxLen: 10 },
  '+81': { minLen: 10, maxLen: 10 },
  '+962': { minLen: 9, maxLen: 9 },
  '+7': { minLen: 10, maxLen: 10 },
  '+254': { minLen: 10, maxLen: 10 },
  '+686': { minLen: 5, maxLen: 5 },
  '+965': { minLen: 8, maxLen: 8 },
  '+996': { minLen: 9, maxLen: 9 },
  '+856': { minLen: 10, maxLen: 10 },
  '+371': { minLen: 8, maxLen: 8 },
  '+961': { minLen: 7, maxLen: 8 },
  '+266': { minLen: 8, maxLen: 8 },
  '+231': { minLen: 7, maxLen: 7 },
  '+218': { minLen: 10, maxLen: 10 },
  '+423': { minLen: 7, maxLen: 7 },
  '+370': { minLen: 8, maxLen: 8 },
  '+352': { minLen: 6, maxLen: 9 },
  '+853': { minLen: 8, maxLen: 8 },
  '+389': { minLen: 8, maxLen: 8 },
  '+261': { minLen: 10, maxLen: 10 },
  '+265': { minLen: 9, maxLen: 9 },
  '+60': { minLen: 9, maxLen: 10 },
  '+960': { minLen: 7, maxLen: 7 },
  '+223': { minLen: 8, maxLen: 8 },
  '+356': { minLen: 8, maxLen: 8 },
  '+692': { minLen: 7, maxLen: 7 },
  '+222': { minLen: 8, maxLen: 8 },
  '+230': { minLen: 7, maxLen: 7 },
  '+52': { minLen: 10, maxLen: 10 },
  '+691': { minLen: 7, maxLen: 7 },
  '+373': { minLen: 8, maxLen: 8 },
  '+377': { minLen: 6, maxLen: 9 },
  '+976': { minLen: 8, maxLen: 8 },
  '+382': { minLen: 8, maxLen: 8 },
  '+1-664': { minLen: 10, maxLen: 10 },
  '+212': { minLen: 9, maxLen: 9 },
  '+258': { minLen: 9, maxLen: 9 },
  '+95': { minLen: 9, maxLen: 10 },
  '+264': { minLen: 9, maxLen: 9 },
  '+674': { minLen: 7, maxLen: 7 },
  '+977': { minLen: 10, maxLen: 10 },
  '+31': { minLen: 9, maxLen: 10 },
  '+599': { minLen: 7, maxLen: 7 },
  '+64': { minLen: 8, maxLen: 10 },
  '+505': { minLen: 8, maxLen: 8 },
  '+227': { minLen: 8, maxLen: 8 },
  '+234': { minLen: 10, maxLen: 10 },
  '+683': { minLen: 4, maxLen: 4 },
  '+850': { minLen: 7, maxLen: 8 },
  '+47': { minLen: 8, maxLen: 8 },
  '+968': { minLen: 8, maxLen: 8 },
  '+92': { minLen: 10, maxLen: 10 },
  '+680': { minLen: 7, maxLen: 7 },
  '+970': { minLen: 9, maxLen: 9 },
  '+507': { minLen: 8, maxLen: 8 },
  '+675': { minLen: 7, maxLen: 8 },
  '+595': { minLen: 9, maxLen: 10 },
  '+51': { minLen: 9, maxLen: 9 },
  '+63': { minLen: 10, maxLen: 10 },
  '+48': { minLen: 9, maxLen: 9 },
  '+351': { minLen: 9, maxLen: 9 },
  '+1-787': { minLen: 10, maxLen: 10 },
  '+974': { minLen: 8, maxLen: 8 },
  '+242': { minLen: 9, maxLen: 9 },
  '+40': { minLen: 10, maxLen: 10 },
  '+250': { minLen: 9, maxLen: 9 },
  '+1-869': { minLen: 10, maxLen: 10 },
  '+1-758': { minLen: 10, maxLen: 10 },
  '+1-784': { minLen: 10, maxLen: 10 },
  '+685': { minLen: 5, maxLen: 7 },
  '+378': { minLen: 8, maxLen: 10 },
  '+239': { minLen: 7, maxLen: 7 },
  '+966': { minLen: 9, maxLen: 9 },
  '+221': { minLen: 9, maxLen: 9 },
  '+381': { minLen: 9, maxLen: 10 },
  '+248': { minLen: 7, maxLen: 7 },
  '+232': { minLen: 8, maxLen: 8 },
  '+65': { minLen: 8, maxLen: 8 },
  '+421': { minLen: 9, maxLen: 9 },
  '+386': { minLen: 8, maxLen: 8 },
  '+677': { minLen: 5, maxLen: 5 },
  '+252': { minLen: 8, maxLen: 8 },
  '+27': { minLen: 10, maxLen: 10 },
  '+82': { minLen: 9, maxLen: 11 },
  '+211': { minLen: 9, maxLen: 9 },
  '+34': { minLen: 9, maxLen: 9 },
  '+94': { minLen: 10, maxLen: 10 },
  '+1-249': { minLen: 10, maxLen: 10 },
  '+597': { minLen: 6, maxLen: 7 },
  '+268': { minLen: 8, maxLen: 8 },
  '+46': { minLen: 9, maxLen: 10 },
  '+41': { minLen: 9, maxLen: 10 },
  '+963': { minLen: 9, maxLen: 9 },
  '+886': { minLen: 9, maxLen: 9 },
  '+992': { minLen: 9, maxLen: 9 },
  '+255': { minLen: 9, maxLen: 10 },
  '+66': { minLen: 9, maxLen: 9 },
  '+228': { minLen: 8, maxLen: 8 },
  '+690': { minLen: 4, maxLen: 4 },
  '+676': { minLen: 5, maxLen: 5 },
  '+1-868': { minLen: 10, maxLen: 10 },
  '+216': { minLen: 8, maxLen: 8 },
  '+90': { minLen: 10, maxLen: 10 },
  '+993': { minLen: 8, maxLen: 8 },
  '+1-649': { minLen: 10, maxLen: 10 },
  '+688': { minLen: 5, maxLen: 5 },
  '+1-340': { minLen: 10, maxLen: 10 },
  '+971': { minLen: 9, maxLen: 9 },
  '+44': { minLen: 10, maxLen: 11 },
  '+380': { minLen: 10, maxLen: 10 },
  '+256': { minLen: 9, maxLen: 10 },
  '+598': { minLen: 8, maxLen: 8 },
  '+998': { minLen: 9, maxLen: 9 },
  '+678': { minLen: 5, maxLen: 7 },
  '+379': { minLen: 8, maxLen: 8 },
  '+58': { minLen: 10, maxLen: 10 },
  '+84': { minLen: 10, maxLen: 10 },
  '+1-284': { minLen: 10, maxLen: 10 },
  '+967': { minLen: 9, maxLen: 9 },
  '+260': { minLen: 9, maxLen: 9 },
  '+263': { minLen: 9, maxLen: 10 },
};

const knownInvalidNumbers = [
  '0000000000', '1111111111', '2222222222', '3333333333', '4444444444',
  '5555555555', '6666666666', '7777777777', '8888888888', '9999999999',
  '1234567890', '9876543210', '0123456789', '0987654321',
  '1000000000', '2000000000', '3000000000', '4000000000',
  '5000000000', '6000000000', '7000000000', '8000000000', '9000000000',
  '1111111110', '1111111112', '1010101010',
  '9999999990', '9999999991', '9999999998',
];

function isArithmeticSequence(digits: string): boolean {
  if (digits.length < 3) return false;
  const diff = parseInt(digits[1]) - parseInt(digits[0]);
  for (let i = 2; i < digits.length; i++) {
    if (parseInt(digits[i]) - parseInt(digits[i-1]) !== diff) return false;
  }
  return true;
}

function hasExcessiveRepetition(digits: string): boolean {
  const freq: Record<string, number> = {};
  for (const d of digits) freq[d] = (freq[d] || 0) + 1;
  return Object.values(freq).some(count => count >= 6);
}

function validatePhone(phone: string, withCountryCode: string = '+91'): { valid: boolean; error: string; digits: string } {
  let digits = phone.replace(/\D/g, '');
  const config = countryPhoneConfig[withCountryCode];
  
  if (!config) {
    return { valid: false, error: 'Unsupported country code', digits: '' };
  }
  
  if (withCountryCode === '+91') {
    if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
    if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  }
  
  if (digits.length < config.minLen || digits.length > config.maxLen) {
    if (config.minLen === config.maxLen) {
      return { valid: false, error: `Phone number must be exactly ${config.minLen} digits for this country`, digits: '' };
    }
    return { valid: false, error: `Phone number must be between ${config.minLen} and ${config.maxLen} digits for this country`, digits: '' };
  }
  
  if (config.startsWith && !config.startsWith.test(digits)) {
    return { valid: false, error: `Phone number must start with ${config.startsWith.toString().replace(/[\^\/\[\]]/g, '').replace('6-9', '6, 7, 8, or 9')}`, digits: '' };
  }
  
  if (knownInvalidNumbers.includes(digits)) {
    return { valid: false, error: 'Please enter a valid phone number', digits: '' };
  }
  
  if (hasExcessiveRepetition(digits)) {
    return { valid: false, error: 'Phone number has too many repeated digits', digits: '' };
  }
  
  if (isArithmeticSequence(digits)) {
    return { valid: false, error: 'Please enter a valid phone number', digits: '' };
  }
  
  const subscriberPart = digits.slice(-6);
  if (/^0+$/.test(subscriberPart)) {
    return { valid: false, error: 'Please enter a valid phone number', digits: '' };
  }
  
  return { valid: true, error: '', digits };
}

function isCourseName(input: string): boolean {
  const upper = input.toUpperCase().trim();
  return courses.some(c => upper === c.toUpperCase() || upper.includes(c.toUpperCase()));
}

export default function KGIChatWidget({ embedded = false }: { embedded?: boolean }) {
  const [isOpen, setIsOpen] = useState(embedded);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [collectionStep, setCollectionStep] = useState<CollectionStep>('name');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneError, setPhoneError] = useState('');
  const [userData, setUserData] = useState({ name: '', phone: '', course: '' });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const welcomeMessage = "Namaste! 🙏 I'm Kaia - your admission assistant at Koshys Group of Institutions.\n\nMay I know your name?";

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        try {
          const parsed = JSON.parse(savedData);
          if (parsed.name && parsed.phone && parsed.course) {
            setUserData(parsed);
            setCollectionStep('done');
            setMessages([{ 
              id: '1', 
              role: 'assistant', 
              content: `Welcome back, ${parsed.name}! 👋\n\nYou previously registered for ${parsed.course}.\n\nIs there anything else you'd like to know about KGI?` 
            }]);
            return;
          }
        } catch (e) {
          console.error('Failed to parse saved data', e);
        }
      }
      setMessages([{ id: '1', role: 'assistant', content: welcomeMessage }]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (collectionStep === 'done' && userData.name && userData.phone && userData.course) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
    }
  }, [collectionStep, userData]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const saveToSheets = async (data: any) => {
    try {
      await fetch('/api/sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, userType: 'student' })
      });
    } catch (e) {
      console.error('Failed to save:', e);
    }
  };

  const handleNameSubmit = async (name: string) => {
    // Validate name - don't accept course names
    if (isCourseName(name)) {
      setMessages(prev => [...prev, 
        { id: Date.now().toString(), role: 'user', content: name },
        { id: (Date.now()+1).toString(), role: 'assistant', content: `I understand you're interested in ${name}! 😊\n\nCould you please tell me your name first?` }
      ]);
      return;
    }
    
    if (name.trim().length < 2) {
      setMessages(prev => [...prev, 
        { id: Date.now().toString(), role: 'user', content: name },
        { id: (Date.now()+1).toString(), role: 'assistant', content: `Please enter a valid name (at least 2 characters).` }
      ]);
      return;
    }
    
    const updatedData = { ...userData, name: name.trim() };
    setUserData(updatedData);
    setCollectionStep('phone');
    
    setMessages(prev => [...prev, 
      { id: Date.now().toString(), role: 'user', content: name },
      { id: (Date.now()+1).toString(), role: 'assistant', content: `Nice to meet you, ${name}! 📞\n\nCould you please share your mobile number with country code?` }
    ]);
  };

  const handlePhoneSubmit = async (phoneInput: string) => {
    const validation = validatePhone(phoneInput, countryCode);
    
    if (!validation.valid) {
      setPhoneError(validation.error);
      return;
    }
    
    const fullPhone = countryCode + validation.digits;
    setPhoneError('');
    setUserData({ ...userData, phone: fullPhone });
    
    try {
      const res = await fetch(`/api/sheets?phone=${encodeURIComponent(fullPhone)}`);
      const data = await res.json();
      
      if (data.found) {
        setCollectionStep('done');
        setUserData({ ...userData, phone: fullPhone, name: data.name, course: data.course || '' });
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...userData, phone: fullPhone, name: data.name, course: data.course || '' }));
        setMessages(prev => [...prev, 
          { id: Date.now().toString(), role: 'user', content: fullPhone },
          { id: (Date.now()+1).toString(), role: 'assistant', content: `Welcome back, ${data.name}! 👋\n\nYou previously registered for ${data.course || 'our courses'}.\n\nIs there anything else you'd like to know about KGI?` }
        ]);
      } else {
        setCollectionStep('course');
        setMessages(prev => [...prev, 
          { id: Date.now().toString(), role: 'user', content: fullPhone },
          { id: (Date.now()+1).toString(), role: 'assistant', content: `Thank you! 📚\n\nWhich course are you interested in?` }
        ]);
      }
    } catch (e) {
      setCollectionStep('course');
      setMessages(prev => [...prev, 
        { id: Date.now().toString(), role: 'user', content: fullPhone },
        { id: (Date.now()+1).toString(), role: 'assistant', content: `Thank you! 📚\n\nWhich course are you interested in?` }
      ]);
    }
  };

  const handleCourseSubmit = async (course: string) => {
    const updatedData = { ...userData, course };
    setUserData(updatedData);
    await saveToSheets(updatedData);
    setCollectionStep('done');
    
    setMessages(prev => [...prev, 
      { id: Date.now().toString(), role: 'user', content: course },
      { id: (Date.now()+1).toString(), role: 'assistant', content: `Perfect! ${course} is a great choice! 🎓\n\nOur admission team will call you at ${userData.phone} shortly.\n\nIs there anything else you'd like to know about KGI?` }
    ]);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    if (collectionStep === 'name') {
      handleNameSubmit(text);
      setInput('');
      return;
    }
    if (collectionStep === 'phone') {
      handlePhoneSubmit(text);
      setInput('');
      return;
    }
    if (collectionStep === 'course') {
      handleCourseSubmit(text);
      setInput('');
      return;
    }
    
    const userMsg: Message = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: text,
          history: messages.map(m => ({ role: m.role, content: m.content }))
        })
      });
      
      const data = await res.json();
      const botMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'assistant', 
        content: data.reply 
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'assistant', 
        content: 'Sorry, please call 808 866 0000 for assistance.' 
      }]);
    } finally {
      setLoading(false);
    }
  };

  const getPlaceholder = () => {
    if (collectionStep === 'name') return 'Your name please...';
    if (collectionStep === 'phone') return 'Mobile number (without 0)';
    if (collectionStep === 'course') return 'Type course name...';
    return 'Ask me anything...';
  };

  const getProgressText = () => {
    if (collectionStep === 'name') return 'Step 1 of 3';
    if (collectionStep === 'phone') return 'Step 2 of 3';
    if (collectionStep === 'course') return 'Step 3 of 3';
    return '';
  };

  const handleMinimize = () => {
    if (embedded) {
      window.parent.postMessage({ type: 'MINIMIZE_KAIA' }, '*');
    } else {
      setIsOpen(false);
    }
  };

  const handleClose = () => {
    if (embedded) {
      window.parent.postMessage({ type: 'CLOSE_KAIA' }, '*');
    } else {
      setIsOpen(false);
    }
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Chat Window */}
      <div style={{
          position: 'fixed',
          bottom: embedded ? '0' : '90px',
          right: embedded ? '0' : '20px',
          width: embedded ? '100%' : '350px',
          height: embedded ? '100%' : '480px',
          maxWidth: '100vw',
          maxHeight: '100vh',
          background: 'white',
          borderRadius: embedded ? '0' : '12px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          zIndex: 99999,
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #a91f23 0%, #7d1418 100%)',
            padding: '12px 15px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(255,255,255,0.3)',
              overflow: 'hidden',
            }}>
              <img src="/ai.png" alt="Kaia" style={{ width: '30px', height: '30px', objectFit: 'contain' }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'white', fontSize: '15px', fontWeight: 600 }}>Kaia</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '11px' }}>Koshys Group of Institutions</div>
            </div>
            
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={handleMinimize}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  padding: '5px',
                  fontSize: '14px',
                  opacity: 0.8,
                }}
                title="Minimize"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="4 14 10 14 10 20"/>
                  <polyline points="20 10 14 10 14 4"/>
                  <line x1="14" y1="10" x2="21" y2="3"/>
                  <line x1="3" y1="21" x2="10" y2="14"/>
                </svg>
              </button>
              <button
                onClick={handleClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  padding: '5px',
                  fontSize: '16px',
                  opacity: 0.8,
                }}
                title="Close"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Progress */}
          {collectionStep !== 'done' && (
            <div style={{
              background: '#fff8e6',
              padding: '8px 15px',
              fontSize: '11px',
              color: '#a91f23',
              fontWeight: 500,
            }}>
              {getProgressText()}
            </div>
          )}

          {/* Messages */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: '15px',
            background: '#f8f9fa',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  maxWidth: '85%',
                  alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  lineHeight: 1.5,
                  background: msg.role === 'user' ? '#a91f23' : 'white',
                  color: msg.role === 'user' ? 'white' : '#212529',
                  border: msg.role === 'assistant' ? '1px solid #e9ecef' : 'none',
                  borderBottomLeftRadius: msg.role === 'assistant' ? '3px' : '12px',
                  borderBottomRightRadius: msg.role === 'user' ? '3px' : '12px',
                }}
              >
                {msg.content.split('\n').map((line, i) => (
                  <p key={i} style={{ margin: i > 0 ? '4px 0 0' : 0 }}>{line}</p>
                ))}
              </div>
            ))}
            {loading && (
              <div style={{
                alignSelf: 'flex-start',
                padding: '10px 14px',
                borderRadius: '12px',
                background: 'white',
                border: '1px solid #e9ecef',
              }}>
                <span style={{ animation: 'bounce 1s infinite', margin: '0 2px' }}>•</span>
                <span style={{ animation: 'bounce 1s infinite 0.2s', margin: '0 2px' }}>•</span>
                <span style={{ animation: 'bounce 1s infinite 0.4s', margin: '0 2px' }}>•</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Course Buttons */}
          {collectionStep === 'course' && (
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '6px',
              padding: '10px',
              background: 'white',
              borderTop: '1px solid #e9ecef',
            }}>
              {courses.map(course => (
                <button
                  key={course}
                  onClick={() => handleCourseSubmit(course)}
                  style={{
                    padding: '6px 12px',
                    background: '#fff8e6',
                    color: '#a91f23',
                    border: '1px solid #a91f23',
                    borderRadius: '15px',
                    fontSize: '11px',
                    fontWeight: 500,
                    cursor: 'pointer',
                  }}
                >
                  {course}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{
            padding: '12px',
            background: 'white',
            borderTop: '1px solid #e9ecef',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}>
            {phoneError && (
              <div style={{ color: '#dc3545', fontSize: '11px', padding: '4px 8px', background: '#fff5f5', borderRadius: '4px' }}>
                {phoneError}
              </div>
            )}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {collectionStep === 'phone' && (
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  style={{
                    padding: '10px 8px',
                    border: '1px solid #dee2e6',
                    borderRadius: '20px',
                    outline: 'none',
                    fontSize: '13px',
                    background: '#f8f9fa',
                  }}
                >
                  {countryCodes.map((cc) => (
                    <option key={cc.code} value={cc.code}>{cc.code}</option>
                  ))}
                </select>
              )}
              <input
                type={collectionStep === 'phone' ? 'tel' : 'text'}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                placeholder={getPlaceholder()}
                style={{
                  flex: 1,
                  padding: '10px 14px',
                  border: '1px solid #dee2e6',
                  borderRadius: '20px',
                  outline: 'none',
                  fontSize: '13px',
                }}
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={loading || !input.trim()}
                style={{
                  width: '38px',
                  height: '38px',
                  background: '#a91f23',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: loading || !input.trim() ? 0.5 : 1,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" x2="11" y1="2" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          {collectionStep === 'done' && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              padding: '10px',
              background: 'white',
              borderTop: '1px solid #e9ecef',
            }}>
              <a href="tel:8088660000" style={{ fontSize: '12px', color: '#a91f23', textDecoration: 'none', fontWeight: 500 }}>
                📞 Call Now
              </a>
              <a href="https://apply.kgi.edu.in" target="_blank" style={{ fontSize: '12px', color: '#a91f23', textDecoration: 'none', fontWeight: 500 }}>
                📝 Apply Now
              </a>
            </div>
          )}
        </div>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}