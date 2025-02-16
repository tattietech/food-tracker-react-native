import { View, Text, ScrollView, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Href, Link, router } from 'expo-router'
import { createUser } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'

const SignUp = () => {

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  })

  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [isSubmitting, setIsSubmitting] = useState(false)

  const submit = async () => {
    if (!form.name || !form.email || !form.password) {
      Alert.alert("Erorr", "Please fill in all the field")
    }

    setIsSubmitting(true);
    try {
      const result = await createUser(form.email, form.password, form.name);

      setUser(result);
      setIsLoggedIn(true);

      router.replace("/home" as Href)
    } catch (error){
      Alert.alert('Error', (error as Error).message)
    } finally {
      setIsSubmitting(false);
    }
    createUser();
  }

  return (
    <SafeAreaView className="h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[82vh] px-4 my-6">
          {/* <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[35px]"
          /> */}

          <Text className="text-2xl text-primary text-semibold mt-10 font-psemibold">
            Sign Up to Food Tracker
          </Text>

          <FormField
            title="Name"
            value={form.name}
            handleChangeText={(e) => setForm({ ...form, name: e })}
            otherStyles="mt-10"
          />

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-primary font-pregular">
              Already have an account?
            </Text>
            <Link href="/sign-in" className="text-lg font-psemibold text-primary">Sign In</Link>
          </View>
        </View>
      </ScrollView>

    </SafeAreaView>
  )
}

export default SignUp