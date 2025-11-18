import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useAuth } from '../../hooks/useAuth';

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    nombreCompleto: '',
    dni: '',
    nacimiento: '',
    celular: '',
    ciudad: '',
    calle: '',
    numero: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (name, value) => {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

const validateForm = () => {
  // Validar campos obligatorios
  const requiredFields = [
    'nombreCompleto', 'dni', 'nacimiento', 'celular', 
    'ciudad', 'calle', 'numero', 'email', 'password', 'confirmPassword'
  ];
  
  const emptyFields = requiredFields.filter(field => !form[field]?.trim());
  if (emptyFields.length > 0) {
    Alert.alert('Error', 'Por favor completa todos los campos');
    return false;
  }

  // Validar DNI (8 dígitos exactos)
  if (!/^\d{8}$/.test(form.dni)) {
    Alert.alert('Error', 'El DNI debe tener exactamente 8 dígitos');
    return false;
  }

  // Validar fecha de nacimiento (formato YYYY-MM-DD)
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(form.nacimiento)) {
    Alert.alert('Error', 'La fecha debe estar en formato YYYY-MM-DD (ej: 1999-09-09)');
    return false;
  }

  // Validar que la fecha sea válida
  const birthDate = new Date(form.nacimiento);
  if (isNaN(birthDate.getTime())) {
    Alert.alert('Error', 'La fecha de nacimiento no es válida');
    return false;
  }

  // Validar que no sea fecha futura
  const today = new Date();
  if (birthDate > today) {
    Alert.alert('Error', 'La fecha de nacimiento no puede ser futura');
    return false;
  }

  // Validar que sea mayor de 18 años - CORREGIDO
  let age = today.getFullYear() - birthDate.getFullYear(); // Cambiado a 'let'
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  if (age < 18) {
    Alert.alert('Error', 'Debes ser mayor de 18 años para registrarte');
    return false;
  }

  // Validar celular (solo números, mínimo 9 dígitos)
  const phoneClean = form.celular.replace(/\D/g, '');
  if (phoneClean.length < 9) {
    Alert.alert('Error', 'El celular debe tener al menos 9 dígitos');
    return false;
  }

  // Validar número de dirección
  if (!/^\d+$/.test(form.numero)) {
    Alert.alert('Error', 'El número de dirección debe ser un valor numérico');
    return false;
  }

  if (form.password !== form.confirmPassword) {
    Alert.alert('Error', 'Las contraseñas no coinciden');
    return false;
  }

  if (form.password.length < 6) {
    Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
    return false;
  }

  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(form.email)) {
    Alert.alert('Error', 'Por favor ingresa un email válido');
    return false;
  }

  return true;
};

const handleSubmit = async () => {
  if (!validateForm()) return;

  setIsLoading(true);
  
  try {
    // Convertir el string de fecha a objeto Date y luego al formato que .NET espera
    const birthDate = new Date(form.nacimiento);
    
    // Preparar datos para enviar al backend EXACTAMENTE como espera el ClienteRequest
    const userData = {
      NombreCompleto: form.nombreCompleto.trim(),
      Dni: form.dni.trim(),
      Nacimiento: form.nacimiento, // Esto se enviará como string "2003-12-09"
      Celular: form.celular.trim(),
      Ciudad: form.ciudad.trim(),
      Calle: form.calle.trim(),
      Numero: parseInt(form.numero),
      Email: form.email.trim().toLowerCase(),
      Password: form.password,
    };

    console.log('Enviando datos al backend:', userData);
    
    const result = await register(userData);
    
    if (result.success) {
      Alert.alert(
        'Éxito', 
        '✅ Registro exitoso. Por favor inicia sesión.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Login')
          }
        ]
      );
      
      // Limpiar formulario
      setForm({
        nombreCompleto: '',
        dni: '',
        nacimiento: '',
        celular: '',
        ciudad: '',
        calle: '',
        numero: '',
        email: '',
        password: '',
        confirmPassword: '',
      });
    } else {
      Alert.alert('Error', result.error || '❌ Error en el registro');
    }
  } catch (error) {
    console.error('Submit error:', error);
    Alert.alert('Error', '❌ Error inesperado: ' + error.message);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>DeliveryYa</Text>
            <Text style={styles.subtitle}>Crear Cuenta</Text>
            <Text style={styles.description}>Regístrate como cliente</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Información Personal */}
            <Text style={styles.sectionTitle}>Información Personal</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre Completo *</Text>
              <TextInput
                style={styles.input}
                value={form.nombreCompleto}
                onChangeText={(value) => handleChange('nombreCompleto', value)}
                placeholder="Juan Pérez"
                placeholderTextColor="#999"
                autoCapitalize="words"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfInput]}>
                <Text style={styles.label}>DNI *</Text>
                <TextInput
                  style={styles.input}
                  value={form.dni}
                  onChangeText={(value) => handleChange('dni', value)}
                  placeholder="12345678"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  maxLength={8}
                />
              </View>

              <View style={[styles.inputGroup, styles.halfInput]}>
                <Text style={styles.label}>Fecha Nacimiento *</Text>
                <TextInput
                  style={styles.input}
                  value={form.nacimiento}
                  onChangeText={(value) => handleChange('nacimiento', value)}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#999"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Celular *</Text>
              <TextInput
                style={styles.input}
                value={form.celular}
                onChangeText={(value) => handleChange('celular', value)}
                placeholder="+51 987 654 321"
                placeholderTextColor="#999"
                keyboardType="phone-pad"
              />
            </View>

            {/* Dirección */}
            <Text style={styles.sectionTitle}>Dirección</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Ciudad *</Text>
              <TextInput
                style={styles.input}
                value={form.ciudad}
                onChangeText={(value) => handleChange('ciudad', value)}
                placeholder="Miramar"
                placeholderTextColor="#999"
                autoCapitalize="words"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.twoThirdsInput]}>
                <Text style={styles.label}>Calle *</Text>
                <TextInput
                  style={styles.input}
                  value={form.calle}
                  onChangeText={(value) => handleChange('calle', value)}
                  placeholder="Av. Principal"
                  placeholderTextColor="#999"
                  autoCapitalize="words"
                />
              </View>

              <View style={[styles.inputGroup, styles.oneThirdInput]}>
                <Text style={styles.label}>Número *</Text>
                <TextInput
                  style={styles.input}
                  value={form.numero}
                  onChangeText={(value) => handleChange('numero', value)}
                  placeholder="123"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Credenciales */}
            <Text style={styles.sectionTitle}>Credenciales</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                value={form.email}
                onChangeText={(value) => handleChange('email', value)}
                placeholder="ejemplo@correo.com"
                placeholderTextColor="#999"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Contraseña *</Text>
              <TextInput
                style={styles.input}
                value={form.password}
                onChangeText={(value) => handleChange('password', value)}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#999"
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirmar Contraseña *</Text>
              <TextInput
                style={styles.input}
                value={form.confirmPassword}
                onChangeText={(value) => handleChange('confirmPassword', value)}
                placeholder="Repite tu contraseña"
                placeholderTextColor="#999"
                secureTextEntry
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.buttonText}>Crear Cuenta</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.loginText}>
              ¿Ya tienes una cuenta?{' '}
              <Text 
                style={styles.loginLink}
                onPress={() => navigation.navigate('Login')}
              >
                Inicia sesión aquí
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FF4D4D',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF4D4D',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  form: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF4D4D',
    marginBottom: 12,
    marginTop: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    paddingBottom: 4,
  },
  inputGroup: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  input: {
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333333',
    backgroundColor: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    width: '48%',
  },
  twoThirdsInput: {
    width: '65%',
  },
  oneThirdInput: {
    width: '32%',
  },
  button: {
    backgroundColor: '#FF4D4D',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingTop: 16,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#666666',
  },
  loginLink: {
    color: '#FF4D4D',
    fontWeight: '600',
  },
});