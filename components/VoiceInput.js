/*
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Voice from '@react-native-voice/voice';

const VoiceInput = ({ onResult }) => {
  const [error, setError] = useState(null);
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    Voice.onSpeechResults = (event) => {
      const spokenText = event.value[0]; // First result from recognition
      console.log('Recognized Speech:', spokenText);

      // Extract amount and category from spoken text
      const amountMatch = spokenText.match(/\$?(\d+(\.\d{1,2})?)/);
      const categoryMatch = spokenText.match(/for (.+)/i);

      const extractedAmount = amountMatch ? parseFloat(amountMatch[1]) : null;
      const extractedCategory = categoryMatch ? categoryMatch[1].trim() : null;

      if (extractedAmount && extractedCategory) {
        onResult({ amount: extractedAmount, category: extractedCategory });
      } else {
        setError('Could not recognize amount or category.');
      }
    };

    Voice.onSpeechError = (err) => {
      setError('Voice recognition failed. Please try again.');
      console.error(err);
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startListening = async () => {
    setError(null);
    setIsListening(true);
    try {
      await Voice.start('en-US');
    } catch (err) {
      setError('Error starting voice recognition.');
      console.error(err);
    }
  };

  const stopListening = async () => {
    setIsListening(false);
    await Voice.stop();
  };

  return (
    <View style={{ marginBottom: 20, alignItems: 'center' }}>
      <TouchableOpacity onPress={isListening ? stopListening : startListening} style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#2ecc71' }}>
          {isListening ? '🛑 Stop Listening' : '🎤 Voice Input'}
        </Text>
      </TouchableOpacity>

      {error && <Text style={{ color: 'red', marginTop: 5 }}>{error}</Text>}
    </View>
  );
};

export default VoiceInput;
*/
