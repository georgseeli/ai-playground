import { useState } from 'react';
import { CreditCard, User, MapPin, Banknote, CheckCircle, AlertCircle } from 'lucide-react';

export default function BankPaymentForm() {
  const [formData, setFormData] = useState({
    recipientName: '',
    street: '',
    city: '',
    postalCode: '',
    country: 'Schweiz',
    iban: '',
    amount: '',
    currency: 'CHF',
    reference: '',
    purpose: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateIBAN = (iban) => {
    const cleanIBAN = iban.replace(/\s/g, '');
    return cleanIBAN.length >= 15 && cleanIBAN.length <= 34 && /^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/.test(cleanIBAN);
  };

  const validatePostalCode = (postalCode, country) => {
    if (country === 'Schweiz') {
      return /^\d{4}$/.test(postalCode);
    } else if (country === 'Deutschland') {
      return /^\d{5}$/.test(postalCode);
    }
    return false;
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.recipientName.trim()) {
      newErrors.recipientName = 'Name ist erforderlich';
    }
    
    if (!formData.street.trim()) {
      newErrors.street = 'Strasse ist erforderlich';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'Ort ist erforderlich';
    }
    
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Postleitzahl ist erforderlich';
    } else if (!validatePostalCode(formData.postalCode, formData.country)) {
      if (formData.country === 'Schweiz') {
        newErrors.postalCode = 'Schweizer PLZ muss 4 Ziffern haben (z.B. 8000)';
      } else if (formData.country === 'Deutschland') {
        newErrors.postalCode = 'Deutsche PLZ muss 5 Ziffern haben (z.B. 10115)';
      }
    }
    
    if (!formData.iban.trim()) {
      newErrors.iban = 'IBAN ist erforderlich';
    } else if (!validateIBAN(formData.iban)) {
      newErrors.iban = 'Ungültige IBAN';
    }
    
    if (!formData.amount.trim()) {
      newErrors.amount = 'Betrag ist erforderlich';
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Betrag muss grösser als 0 sein';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      setIsSubmitted(true);
      console.log('Zahlung erfasst:', formData);
    }
  };

  const formatIBAN = (value) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  const handleIBANChange = (e) => {
    const formatted = formatIBAN(e.target.value.toUpperCase());
    setFormData(prev => ({
      ...prev,
      iban: formatted
    }));
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Zahlung erfasst</h2>
          <p className="text-gray-600 mb-6">
            Die Bankzahlung wurde erfolgreich erfasst und wird verarbeitet.
          </p>
          <button 
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                recipientName: '',
                street: '',
                city: '',
                postalCode: '',
                country: 'Schweiz',
                iban: '',
                amount: '',
                currency: 'CHF',
                reference: '',
                purpose: ''
              });
            }}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Neue Zahlung
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6">
            <div className="flex items-center space-x-3">
              <CreditCard className="w-8 h-8 text-white" />
              <h1 className="text-2xl font-bold text-white">Bankzahlung erfassen</h1>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Empfänger Daten */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <User className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-800">Empfänger</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="recipientName"
                    value={formData.recipientName}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.recipientName ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Max Mustermann"
                  />
                  {errors.recipientName && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.recipientName}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Adresse */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-800">Adresse</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Strasse, Hausnummer *
                  </label>
                  <input
                    type="text"
                    name="street"
                    value={formData.street}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.street ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={formData.country === 'Schweiz' ? 'Musterstrasse 123' : 'Musterstraße 123'}
                  />
                  {errors.street && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.street}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Postleitzahl *
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.postalCode ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={formData.country === 'Schweiz' ? '8000' : '10115'}
                  />
                  {errors.postalCode && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.postalCode}
                    </p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ort *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.city ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={formData.country === 'Schweiz' ? 'Zürich' : 'Berlin'}
                  />
                  {errors.city && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.city}
                    </p>
                  )}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Land
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Schweiz">Schweiz</option>
                    <option value="Deutschland">Deutschland</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Banking Details */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Banknote className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-800">Zahlungsdetails</h2>
              </div>
              
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    IBAN *
                  </label>
                  <input
                    type="text"
                    name="iban"
                    value={formData.iban}
                    onChange={handleIBANChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono ${
                      errors.iban ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder={formData.country === 'Schweiz' ? 'CH93 0076 2011 6238 5295 7' : 'DE89 3704 0044 0532 0130 00'}
                    maxLength="34"
                  />
                  {errors.iban && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.iban}
                    </p>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Betrag *
                    </label>
                    <input
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={handleInputChange}
                      step="0.01"
                      min="0"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors.amount ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="100.00"
                    />
                    {errors.amount && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.amount}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Währung
                    </label>
                    <select
                      name="currency"
                      value={formData.currency}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="CHF">CHF</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Referenz
                  </label>
                  <input
                    type="text"
                    name="reference"
                    value={formData.reference}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Rechnungsnummer, Kundennummer, etc."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Verwendungszweck
                  </label>
                  <textarea
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Beschreibung des Zahlungszwecks..."
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex space-x-4 pt-4">
              <button
                type="button"
                onClick={handleSubmit}
                className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-colors font-medium"
              >
                Zahlung erfassen
              </button>
              <button
                type="button"
                onClick={() => {
                  setFormData({
                    recipientName: '',
                    street: '',
                    city: '',
                    postalCode: '',
                    country: 'Schweiz',
                    iban: '',
                    amount: '',
                    currency: 'CHF',
                    reference: '',
                    purpose: ''
                  });
                  setErrors({});
                }}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:ring-4 focus:ring-gray-200 transition-colors"
              >
                Zurücksetzen
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}