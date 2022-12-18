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

type ButtonImages = {
  spinButton: string
  spinButtonHover: string
  spinButtonDisabled: string
  spinButtonDown: string
}

enum ButtonStates {
  Normal,
  Hover,
  Pressed,
  Disabled
}

export class GUIManager {
  advancedTexture?: AdvancedDynamicTexture
  loadedGUI: AdvancedDynamicTexture | null
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
    this.loadedGUI = null
    //this.GUIJsonURL = 'http://localhost:3000/GUI'
    this.GUIJsonURL = 'https://pokeslot.netlify.app/.netlify/functions/GUI'
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

    this.buttonImages = {
      spinButton: '',
      spinButtonHover: '',
      spinButtonDisabled: '',
      spinButtonDown: ''
    }
    this.buttonState = ButtonStates.Normal
  }

  loadUi = async (
    rollButtonCallback: () => void,
    betSliderCallback: (value: number) => void,
    callback: () => void
  ) => {
    this.advancedTexture = AdvancedDynamicTexture.CreateFullscreenUI(
      'GUI',
      true
    )
    this.loadedGUI = await this.advancedTexture.parseFromURLAsync(
      this.GUIJsonURL
    )
    this.setupControls(betSliderCallback)
    this.setupButton(rollButtonCallback)
    callback()
  }

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

  setButtonObservables(action: () => void) {
    if (this.buttonCtrl) {
      this.buttonCtrl.onPointerEnterObservable.add(() => {
        if (this.buttonState === ButtonStates.Normal) {
          this.changeButtonState(ButtonStates.Hover)
        }
      })

      this.buttonCtrl.onPointerOutObservable.add(() => {
        if (this.buttonState === ButtonStates.Hover) {
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

  buttonPressedToggle() {
    this.changeButtonState(ButtonStates.Disabled)
    setTimeout(() => {
      this.changeButtonState(ButtonStates.Normal)
    }, 3600)
  }

  setupButton(action: () => void) {
    if (this.buttonCtrl) {
      this.buttonImages.spinButton = spinButton
      this.buttonImages.spinButtonHover = spinButtonHover
      this.buttonImages.spinButtonDisabled = spinButtonDisabled
      this.buttonImages.spinButtonDown = spinButtonDown

      this.buttonCtrl.disabledColor = 'transparent'
      this.changeButtonState(ButtonStates.Normal)
      this.setButtonObservables(action)
    }
  }

  changeButtonState(state: ButtonStates) {
    this.buttonState = state
    this.updateButtonImage()
  }

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
}
