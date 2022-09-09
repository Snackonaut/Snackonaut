import { Camera } from 'expo-camera'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect } from 'react'
import { useTranslation } from "react-i18next";
import { Alert, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import * as Url from "url";

let camera: Camera

export default function SnackCamera() {
    const [startCamera, setStartCamera] = React.useState(false)
    const [previewVisible, setPreviewVisible] = React.useState(false)
    const [capturedImage, setCapturedImage] = React.useState<any>(null)
    const [cameraType, setCameraType] = React.useState(Camera.Constants.Type.back)
    const [flashMode, setFlashMode] = React.useState('off')

    useEffect(() => {
        // TODO
    }, [capturedImage]);

    const __startCamera = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync()
        console.log(status)
        if (status === 'granted') {
            setStartCamera(true)
        } else {
            Alert.alert('Access denied')
        }
    }
    const __takePicture = async () => {
        const photo: any = await camera.takePictureAsync()
        console.log(photo)
        setPreviewVisible(true)
        //setStartCamera(false)
        setCapturedImage(photo)
    }
    const __savePhoto = () => {
    }
    const __retakePicture = () => {
        setCapturedImage(null)
        setPreviewVisible(false)
        __startCamera()
    }
    const __handleFlashMode = () => {
        if (flashMode === 'on') {
            setFlashMode('off')
        } else if (flashMode === 'off') {
            setFlashMode('on')
        } else {
            setFlashMode('auto')
        }
    }
    const __switchCamera = () => {
        if (cameraType === 'back') {
            setCameraType(Camera.Constants.Type.front)
        } else {
            setCameraType(Camera.Constants.Type.back)
        }
    }
    return (
        <View style={ styles.container }>
            { startCamera ? (
                <View
                    style={ {
                        flex: 1,
                        width: '100%'
                    } }
                >
                    { previewVisible && capturedImage ? (
                        <CameraPreview photo={ capturedImage } savePhoto={ __savePhoto }
                                       retakePicture={ __retakePicture }/>
                    ) : (
                        <Camera
                            type={ cameraType }
                            style={ { flex: 1 } }
                            ref={ (r) => {
                                camera = r
                            } }
                        >
                            <View
                                style={ {
                                    flex: 1,
                                    width: '100%',
                                    backgroundColor: 'transparent',
                                    flexDirection: 'row'
                                } }
                            >
                                <View
                                    style={ {
                                        position: 'absolute',
                                        bottom: 0,
                                        flexDirection: 'row',
                                        flex: 1,
                                        width: '100%',
                                        padding: 20,
                                        justifyContent: 'space-between'
                                    } }
                                >
                                    <View
                                        style={ {
                                            alignSelf: 'center',
                                            flex: 1,
                                            alignItems: 'center'
                                        } }
                                    >
                                        <TouchableOpacity
                                            onPress={ __takePicture }
                                            style={ {
                                                width: 70,
                                                height: 70,
                                                bottom: 0,
                                                borderRadius: 50,
                                                backgroundColor: '#fff'
                                            } }
                                        />
                                    </View>
                                </View>
                            </View>
                        </Camera>
                    ) }
                </View>
            ) : (
                <View
                    style={ {
                        flex: 1,
                        backgroundColor: '#fff',
                        justifyContent: 'center',
                        alignItems: 'center'
                    } }
                >
                    <TouchableOpacity
                        onPress={ __startCamera }
                        style={ {
                            width: 130,
                            borderRadius: 4,
                            backgroundColor: '#14274e',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: 40
                        } }
                    >
                        <Text
                            style={ {
                                color: '#fff',
                                fontWeight: 'bold',
                                textAlign: 'center'
                            } }
                        >
                            Take picture
                        </Text>
                    </TouchableOpacity>
                </View>
            ) }

            <StatusBar style="auto"/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center'
    }
})

const CameraPreview = ({ photo, retakePicture, savePhoto }: any) => {
    const { t } = useTranslation();

    return (
        <View
            style={ {
                backgroundColor: 'transparent',
                flex: 1,
                width: '100%',
                height: '100%'
            } }
        >
            <ImageBackground
                source={ { uri: photo && photo.uri } }
                style={ {
                    flex: 1
                } }
            >
                <View
                    style={ {
                        flex: 1,
                        flexDirection: 'column',
                        padding: 15,
                        justifyContent: 'flex-end'
                    } }
                >
                    <View
                        style={ {
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        } }
                    >
                        <TouchableOpacity
                            onPress={ retakePicture }
                            style={ {
                                width: 130,
                                height: 40,

                                alignItems: 'center',
                                borderRadius: 4
                            } }
                        >
                            <Text
                                style={ {
                                    color: '#fff',
                                    fontSize: 20
                                } }
                            >
                                Re-take
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={ savePhoto }
                            style={ {
                                width: 130,
                                height: 40,

                                alignItems: 'center',
                                borderRadius: 4
                            } }
                        >
                            <Text
                                style={ {
                                    color: '#fff',
                                    fontSize: 20
                                } }
                            >
                                { t("camera.analyzePicture") }
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </View>
    )
}
