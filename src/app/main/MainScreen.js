import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Image
} from "react-native";

import { Container } from "@common";
import Layout from "@constants/Layout";
import letters from "@services/letters";

import ClosedHand from "./object/ClosedHand";

export default class MainScreen extends Component {
  state = {
    playing: false,
    defaultTimer: 3 * 60,
    timer: 3 * 60,
    lettersArray: letters,
    playingLetter: undefined,
    stoped: false
  };

  _startGame = async () => {
    const { lettersArray } = this.state;
    const randomIndex =
      Math.random()
        .toString()
        .substr(2, 3) % lettersArray.length;

    await this.setState({ playing: true, playingLetter: randomIndex });

    this.interval = setInterval(() => {
      this.setState(prevState => ({ timer: prevState.timer - 1 }));
    }, 1000);
  };

  _stopGame = () => {
    clearInterval(this.interval);
    this.setState({ stoped: true });
  };

  _newGame = () => {
    const { defaultTimer, lettersArray, playingLetter } = this.state;
    const newLetters = [...lettersArray];
    newLetters.splice(playingLetter, 1);

    this.setState({
      timer: defaultTimer,
      lettersArray: newLetters.length == 0 ? letters : newLetters,
      playing: false,
      playingLetter: "",
      stoped: false
    });
  };

  render() {
    const { playing, timer, lettersArray, playingLetter, stoped } = this.state;

    if (timer == 0) {
      this._stopGame();
    }

    if (playing) {
      const minutes = Math.floor(timer / 60);
      const seconds = timer - minutes * 60;
      return (
        <Container style={styles.rootStyle}>
          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>
              Tempo restante: {minutes.toString().padStart(2, "0")}:
              {seconds.toString().padStart(2, "0")}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.contentContainer}
            onPress={this._stopGame}
          >
            <Image
              style={styles.imageStyle}
              source={require("@assets/images/stop-red-button.png")}
              resizeMode="contain"
            />
            <Text style={styles.letterStyle}>
              {lettersArray[playingLetter]}
            </Text>
          </TouchableOpacity>
          {!stoped && (
            <View style={styles.footerContainer}>
              <Text style={styles.titleText}>STOP</Text>
            </View>
          )}
          {stoped && (
            <TouchableWithoutFeedback onPress={this._newGame}>
              <View style={styles.footerContainer}>
                <Text style={styles.titleText}>CLIQUE AQUI PRA REINICIAR</Text>
              </View>
            </TouchableWithoutFeedback>
          )}
        </Container>
      );
    }

    return (
      <Container style={styles.rootStyle}>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>
            Da um tapa de leve na tela do amiguinho pra começar
          </Text>
        </View>
        <TouchableWithoutFeedback onPress={this._startGame}>
          <View style={styles.contentContainer}>
            <ClosedHand size="extra-large" />
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.footerContainer}>
          <Text style={styles.titleText}>A-DE-DO-NHA</Text>
        </View>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  rootStyle: {
    backgroundColor: "#FFF"
  },
  titleContainer: {
    marginVertical: 20,
    height: 100,
    justifyContent: "center",
    alignItems: "center"
  },
  titleText: {
    fontFamily: "coolvetica",
    fontSize: 30,
    textAlign: "center"
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  imageStyle: {
    width: Layout.window.width * 0.9,
    height: Layout.window.width * 0.9
  },
  letterStyle: {
    fontFamily: "coolvetica",
    fontSize: 200,
    textAlign: "center",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    position: "absolute",
    color: "#FFF",
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3
  },
  footerContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 75,
    width: "100%"
  }
});
