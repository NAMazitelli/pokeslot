import { Nullable } from '@babylonjs/core'
import {
  AdvancedDynamicTexture,
  Button,
  Image,
  Slider,
  TextBlock,
  Checkbox
} from '@babylonjs/gui'

import * as backgroundImage from '../../../public/images/background.png'
import * as spinButton from '../../../public/images/spinButton.png'
import * as spinButtonHover from '../../../public/images/spinButtonHover.png'
import * as spinButtonDown from '../../../public/images/spinButtonDown.png'
import * as spinButtonDisabled from '../../../public/images/spinButtonDisabled.png'

enum ButtonStates {
  Normal,
  Hover,
  Pressed,
  Disabled
}

export class GUIManager {
  advancedTexture?: AdvancedDynamicTexture
  GUIJsonURL: string
  buttonImages: ButtonImages
  buttonState: ButtonStates
  /* ---- CONTROLS ----- */
  buttonCtrl: Nullable<Button>
  imageCtrl: Nullable<Image>
  smallLabel: Nullable<TextBlock>
  bigLabel: Nullable<TextBlock>
  bonusLabel: Nullable<TextBlock>
  coinsLabel: Nullable<TextBlock>
  earningsLabel: Nullable<TextBlock>
  betLabel: Nullable<TextBlock>
  betSlider: Nullable<Slider>
  bgImage: Nullable<Image>
  checkBox: Nullable<Checkbox>
  /* ---- END CONTROLS ----*/

  constructor() {
    this.advancedTexture
    this.GUIJsonURL =
      process.env.NODE_ENV === 'production'
        ? 'https://pokeslot.netlify.app/.netlify/functions/GUI'
        : 'http://localhost:3000/GUI'
    this.buttonImages = {
      spinButton: spinButton,
      spinButtonHover: spinButtonHover,
      spinButtonDisabled: spinButtonDisabled,
      spinButtonDown: spinButtonDown
    }
    this.buttonState = ButtonStates.Normal
    /* ---- CONTROLS ----- */
    this.buttonCtrl = null
    this.imageCtrl = null
    this.smallLabel = null
    this.bigLabel = null
    this.bonusLabel = null
    this.coinsLabel = null
    this.earningsLabel = null
    this.betLabel = null
    this.betSlider = null
    this.bgImage = null
    this.checkBox = null
    /* ---- END CONTROLS ----*/
  }

  // load ui from json
  async loadUi(
    rollButtonCallback: () => void,
    betSliderCallback: (value: number) => void,
    callback: () => void
  ) {
    this.advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI(
      'GUI',
      true
    )
    await this.advancedTexture.parseFromURLAsync(this.GUIJsonURL)
    this.setupControls(betSliderCallback)
    this.setupButton(rollButtonCallback)
    callback()
  }

  // set up UI controls
  setupControls(betSliderCallback: (value: number) => void) {
    if (this.advancedTexture) {
      this.buttonCtrl = this.advancedTexture.getControlByName(
        'Button'
      ) as Button
      this.imageCtrl = this.advancedTexture.getControlByName(
        'ButtonImage'
      ) as Image
      this.smallLabel = this.advancedTexture.getControlByName(
        'SmallWinsLabel'
      ) as TextBlock
      this.bigLabel = this.advancedTexture.getControlByName(
        'BigWinsLabel'
      ) as TextBlock
      this.bonusLabel = this.advancedTexture.getControlByName(
        'BonusLabel'
      ) as TextBlock
      this.coinsLabel = this.advancedTexture.getControlByName(
        'CoinsLabel'
      ) as TextBlock
      this.earningsLabel = this.advancedTexture.getControlByName(
        'EarningsLabel'
      ) as TextBlock
      this.betLabel = this.advancedTexture.getControlByName(
        'BetsLabel'
      ) as TextBlock
      this.bgImage = this.advancedTexture.getControlByName(
        'BackgroundImage'
      ) as Image
      this.bgImage.source = backgroundImage

      this.checkBox = this.advancedTexture.getControlByName(
        'Checkbox'
      ) as Checkbox
      this.betSlider = this.advancedTexture.getControlByName(
        'BetsSlider'
      ) as Slider
      this.betSlider.minimum = 1
      this.betSlider.maximum = 100
      this.betSlider.onValueChangedObservable.add(value =>
        betSliderCallback(value)
      )
    }
  }

  // update all counters together
  updateAllCounters(
    small: number,
    big: number,
    bonus: number,
    coins: number,
    earnings: number,
    bet: number
  ) {
    this.updateSmallCounter(small)
    this.updateBigCounter(big)
    this.updateBonusCounter(bonus)
    this.updateCoinsCounter(coins)
    this.updateEarningsCounter(earnings)
    this.updateBetCounter(bet)
  }

  // update button images
  setButtonObservables(action: () => void) {
    if (this.buttonCtrl) {
      this.buttonCtrl.onPointerEnterObservable.add(() => {
        if (this.buttonState === ButtonStates.Normal) {
          document.body.style.cursor = 'pointer'
          this.changeButtonState(ButtonStates.Hover)
        }
      })

      this.buttonCtrl.onPointerOutObservable.add(() => {
        if (this.buttonState === ButtonStates.Hover) {
          document.body.style.cursor = 'default'
          this.changeButtonState(ButtonStates.Normal)
        }
      })

      this.buttonCtrl.onPointerDownObservable.add(() => {
        this.changeButtonState(ButtonStates.Pressed)
      })

      this.buttonCtrl.onPointerUpObservable.add(async () => {
        this.buttonPressedToggle()
        action()
      })
    }
  }

  // update button state to disabled and back to normal after spinning
  buttonPressedToggle() {
    this.changeButtonState(ButtonStates.Disabled)
    setTimeout(() => {
      this.changeButtonState(ButtonStates.Normal)
    }, 3600)
  }

  // set up button
  setupButton(action: () => void) {
    if (this.buttonCtrl) {
      this.buttonCtrl.disabledColor = 'transparent'
      this.changeButtonState(ButtonStates.Normal)
      this.setButtonObservables(action)
    }
  }

  // change button state to update image
  changeButtonState(state: ButtonStates) {
    this.buttonState = state
    this.updateButtonImage()
  }

  // update button image based on state
  updateButtonImage() {
    if (this.buttonCtrl && this.imageCtrl) {
      switch (this.buttonState) {
        case ButtonStates.Normal:
        default:
          this.buttonCtrl.isEnabled = true
          this.imageCtrl.source = this.buttonImages.spinButton
          break
        case ButtonStates.Hover:
          this.imageCtrl.source = this.buttonImages.spinButtonHover
          break

        case ButtonStates.Pressed:
          this.imageCtrl.source = this.buttonImages.spinButtonDown
          break

        case ButtonStates.Disabled:
          this.buttonCtrl.isEnabled = false
          this.imageCtrl.source = this.buttonImages.spinButtonDisabled
          break
      }
    }
  }

  /*
   * SEPARATE COUNTERS UPDATE METHODS
   */
  updateSmallCounter(small: number) {
    if (this.smallLabel) {
      this.smallLabel.text = small.toString()
    }
  }

  updateBigCounter(big: number) {
    if (this.bigLabel) {
      this.bigLabel.text = big.toString()
    }
  }

  updateBonusCounter(bonus: number) {
    if (this.bonusLabel) {
      this.bonusLabel.text = bonus.toString()
    }
  }

  updateCoinsCounter(coins: number) {
    if (this.coinsLabel) {
      this.coinsLabel.text = coins.toString()
    }
  }

  updateEarningsCounter(earnings: number) {
    if (this.earningsLabel) {
      this.earningsLabel.text = earnings.toString()
    }
  }

  updateBetCounter(bet: number) {
    if (this.betLabel) {
      this.betLabel.text = bet.toString()
    }
  }
  /*
   *  END SEPARATE COUNTERS UPDATE METHODS
   */
}
