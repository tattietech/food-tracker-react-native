import Toast from "react-native-toast-message";

export const showSuccessToast = (title: string, text:string): void => {
    Toast.show({
          type: "success",
          text1: title,
          text2: text ?? ""
        });
}

export const showErrorToast = (title: string, text:string): void => {
    Toast.show({
          type: "error",
          text1: title,
          text2: text ?? ""
        });
}