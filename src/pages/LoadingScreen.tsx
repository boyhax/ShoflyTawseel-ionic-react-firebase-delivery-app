import React from "react";
import { IonPage, IonLoading, IonContent } from "@ionic/react";
import { TT } from "../components/utlis/tt";
import "./LoadingScreen.css";
import Page from "../components/Page";
interface Props {
  onClose?: () => void;
}
const LoadingScreen: React.FC<Props> = ({ onClose }) => {
  return (
    <div className={'w-screen h-screen'} >
      <IonContent fullscreen>
        <div className={"flex z-[1000] flex-col gap-6 justify-center items-center w-full h-full"}>
        {/* <img src={require('../assets/icons8-dratini-50.png')}/> */}
        {/* <img 
        className={'text-yellow-300'}
        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAPnklEQVR4nO1bC3gU1dkeIHM24W5RyEwCVAte0oqme84uIgQRfhERFJFKQW29gFbbWrxUpVAL6i+0UqNSvPEXaQU1aos3KJCZTYBkz5ndXMhOCAmE7GUmIeQCyW7wArr/883u8icxm+wGWpP4v8+zz7Ozc+bM7Zz3e7/3O8tx/4/OYbLav89b6J2c2clz3yWYCJuJCM1DhH6NMDvNmZ3nc98JTN57Ho/px4jQL8yLSvakLyyREaEu7ruAJAtN5TE7MGwyO/ieXFfucgceNVnZKkToPq7PY6otARG29/xpzv20rOl4qaflJviZt9B7eMxquQVZA7i+DGSmy0yENciFx4+q7sBTkd+TJuanIMxOIazM4fosptoSeEKrb19xKNfl8Vevr60dLOjypyk+aRns5jF9icfMl5ieN5bri0jAylRE6Jf71KbjLk/geUGXHxJ0uT65Wgrd8FRbIo+ZhAg9xhO2iOtrQIQ9Pvgq5bDqCQRVd/OtoiaroiafmQYG0lTEE/YChETgCp6wn3OT9g2J1qegS4tSvflJXG8AwnTD2BsKGTyAXPfxH4ua9HVydfasDtuanZfClECEHkeEtvCYyTxmaxG2z+cmhm74e/Xbh4q6HEzxSVdwvQEIs43jbyrKhwewx12fJujSlyk+2zVtGgWzBpidrdSg2TkQWehsnrBnEaa5MIUQYb+GXSk+W6qoyacF3dY7xBNP2B9HzyxQ4AGUeFrMgi5ViFr2/bBP1KQXRU2uhTcKI0PQZU3U5H+k+KQ74U236uOQMS3CGOPOFbjeggSsPGCy0vrMt6sLXG7/pnRtz8Lk6uw02Cfo0hK4WVGTJqX4pGsFXf61oEtvCrrcIGpyi6hJK6EdT5ibN9Ofcr0SabbBCNM3IN6nzCxSPrDVFapu/y+DwWD/qIeoWUjUpJ9AxIBtHrMKnrB7I/tTvbZxo2p2Djr7iwv247H9Lh7TNQizraBKISQjzBpbfyCMI8zsCLMsRNgTCYRlxJ3AIat9PI/ZTkRo4OEXqnJUT0AuqfSPiuVYHtMdcJGRbVGTdwm6vLobd9y2Xys1I8KC4nUFNES+7BEYachMbzJhZQZ8gIB5rNwO0Qxh+goiVDE4CdN6IHhTev64OE4Z7McTtgRhdhIvKrEVHGo+4nI3TeryQgnL5DH9V2QbwqigS0XcWQJZ6G8HX60cKvY0vyXoUuxTzEKH8ti+kCfMZihZQv/CTSiOfUQmEIZhqI2c7nAqB5sbSr0tN3d6oWb7DZBBcmbnMNgWNekSIE1Ry0mP+aQd9Usom35/Wc5DngNPCrr8OUy9ePswme3X8ISWwScRK6NjPjAxPW8sT+jhkdc6igsO+5tcnpbo+cDE/CREmB+GYuQnQZc3JFdLGVw3kUDYVeBHbNl1bGeKLq8WNSmnu32BaIMRCvfDETYivhSZMP37s4vy9h8J+DubDjxhf0KYFp2rzJHHNHvsrEJa4GmaC6FZ0OXlgi49IehStqBLTyZX51wWV4egXQgrAKKM67gEwjCovpkPlAIxHj3gDnQY4wcSlgzc0ToaCLo8U9Dlw6ne7JR4zoks9GaYu3/bcfSdFJ88W9DlL0BbjKqRfijo8p+AX0RN/krQ5XdH1eRe2FV/VVXBxFy1cfEvnqt8E0g1ASsknuvhkIUtgDxg3du6Q3UHcmzBYEKH7QhbCUkTeImwDXMW3hjkF2M8e8+LncCYZv25K9vpbbw8fLOvt28G2kTU5FxBlxqjSXdA0tXKLcOnMCVEhiwIHxitXLzgCfuzycJq80qbTqiewONRjRXM9oCzBPYa/DS2yjZc1CSXqMmKqOV2SUKI0L8PnKi4peKmuwXddi8IrqgjKJg1QNTk/4YRImry9Db7FmQNQJi+iQj9nCfsZYSVWSaz8wcmrFwUyVvig9k5ECTvlbeV7FXd/pOq90TH8dXsPB8YF4TJIKvd0BEjj2aPgrclatIxUJTRTgEONMTw1X/1rR/t2SXC2xU16bGuLk3QpXWiJtWNqtk58kxfhnii9TxWzioStQEoLEToV69/eNSluv1n4n57wI0jzIphKAObGz8GbQmhC5XVjo7hLfQKEGFzl5VtY1rTCFGTt4ua5IDjuC4AiZqgy/sFTXo1EsEMMWShnYbvbgER+s751zj2Q/JU6vHPiNpwQvEgHtN/wBAEguysT3hgPKGesbMK9xQeCVwBQkrU5ICg2y7lgsF+o2psBqd0BkHPnifo0mcw5RCmT8Io5M4Vkiw0NTJvEGEXA6E8u8mnrPSUu1OqQ9ZZR4jod46LnlcY4QnT/GGTHa5PaN00UbPdCAyfXG0zNEWKT7YCD4yoi27AtBoF8mU++/hEK/uIx/RF7lyAJ2wxhEHQ4f93Y/T14RlO1xrvkeAYPed4G6+g7TQ4DUWWTq6a5zH7JNGqaBver56f4ssZL+jScVGTMiNNxlVsNwm6fKIrKfzi27U/mPdY+R+uXFjyLxNhfpOZ/pI7W5iMZIOdAvbnMV3XOnEClZa5TVfHaPJXoibNbX8sj+lSGNaQX3Tce7AfMD6ysLo1m3xLwEARNalM1KQdwO6tWwq6/KGoyS932E2abfB5UxyrTBZIflgzT+gHiLAVcSm+DjGuwgR5fsY9ak7yjIJdCLP9Rlgx22+A3Tyhuy+9uThvka84eLEvd1f7wxFhr/GEvdfJyFplIqz52b/6Vl9QawMnmgGRXVS528gnWkPQ5T+Kmryzgz6u5DEt5wn1JpjpfWDgcucKPKZLTYQdfz/nmA0eBLLQGhjSYIOF4r19PkyN9eW+k6mafLr9hSNM30WEvRqV8TE7vfwVz8cby+qGwFsXNbkympMUlsC09W8mC52GMPsMEfY/XWZ6MUSSbwDIy7zYlTv6+sL84ZMdBx54rnJtREnBtIAQB98zlqi5F5bvPTXP63ymtYkCIyCa7gb/AGy4Erf/9rDLVD3y6O6LuCgALSBqsrNdyDwByrPDA4JP9QcyFXTpPbD0IJPsikQ7cInYqeUbPPkQ9//yQU3RoEnKZrDEQUmBUQFOTZjl65CVnr7gVqXskUzPbuehprUu7eRoIKEQB7QFKDJ4+xs/Ovpu0AhxOwd1ZaCKmvSsoMvSmcwORmSU0SXo8k3h5OlzUZO3ipr8QKo353IubvIj9IvlG7x5JsKaXO5AGchbcGK+2TrYP8HsuDpsqzUPtCrajcvKpQumOf8Z1t0fGnyA6dPGQ8G05seLXZ8e0JoujvV6RE3+G3zgO4/p82DBtZezRhjUpFdFTToFnAHqk+suEGEPD71aKX8pS89JsrLNauXJMdffp6b94Q3vpqc3ej9Yu1nbuXVnbU7hYX++6vFvBMMEMi6jvE7YKiBMnrBdMD+NqQBsD34eoYfBPXpsbV0cw9HggBJRkx5tlXH+rH0bqGQJupwn6LbJ3NmCx3SNeJ3T4XL7t8E2DHtjsYTBAUYNIMIFJ0fPKrQ/s8lLVbffq3pa7uvMTO0OxlbZEiHZEXTpOkTY74xp1c7wBI4AI/acnZTH9KULZxfQi24sbIxoefDY4CGAPwDhJtHsHIOwcgvCdAtMlxEZDnXb3oZDqsf/sbOy8RuhrLsAJQgPAEjMSLII+13r/fBgQvNduuRcnZOD+XzpvKK8tZu1Hdwl+4aYLPSekOXVsbwE7Q0jwmShJ/68VXO6PIEtZ3sNFRX1Q/d7/Zfbquon3u8rvWPpqkNXGWaG2WFp3Q4eTNwk1xUQpluuXFi8R/X485KnOzLDUvjxaJo+HJNPZdyr2kbOcL4Yq53eHlRtTntivfupRSsOvT/lHjUn/acle+AzbWmp7Ye3Fu+B0AcahPtPlMtMhDWMmVXIQh67fX6nB6SpCGHW8EhmVZ7L438t3vMNvS7/e6nXF76SaGXVYY1RYaxVgkIHZllQrwAvAnz+1seJmrRR1HbHHE1ix1RYE2C/C/x0CF+xHAJxeUSGw+Xy+D8rPXIy5sUUiLB5EBp5Qg+C+oxVwwPrQ80yUsb71oGwcgm8vZWveexglsQSDXhM7wivOVgZbylL1KS7QUGCX8D1FPAwdSzs2Ef76t2q27+5oiJoitYWihThm2/D6rFC1OQtoib9netRMDt5yBJNFlb3xoc1JS6Pv6jE558QrTl4ASCYunMqkLjgDHM9DlNtiWCNw9udtlTNKTgcaP6UNj5oRAoLnd06c4tUfyI2ep8AstA0QxMQ9ivQDqANzihIkLGYaa2d2nCOEdVW63XgMV0NJTJYWwg3Peku15YEs91qmBUTigchTN+CNUaGogzxxnqesPe5vgIe4rWF/hbWHo2bU5Tv8gTeatsi2J/H9DmQ0eH2SxCmHVrlvQ48Vn4EczpUWWYvj51dSF0ev71No0n7hjjKmldEqs0JFjoFrPP/iML7dyPBQieCFgAbHXJ/cHtLjjSfAucn0gbK1Lc9UZELy3BgG8pVwBGQXHG9H8F+UBsEn99wjjFrEGYUOHcrjbrq9r8CLaDcvuyFqn0uT+BO4xALHWqQpIV2T9GZnTwIqbgWP/w7MdDsFAweIMwP/zWAEtmgq1hV8ZHmLzds09LhZm9bXp4DK9Iix4DtFiHFuADVJ0K3Gw+wQ7fq20IaeIrKHGOhEmElcIEvZ1Vnz3344AL4PvJaZ5HqCZxw6sGB0Bw4wFjZFQ9g5GBm5wmtNLQEVqKX6b4NIEwfBT4YPsWxY8gk5elPaN0d196nPh2Sv/TrT/IaPZFpYOgFwq6PczHXLh6zUhBRhk9goRO5ngSEqTpn2UHbg2sqnxs22ZE7bLLjQNJE5oWVW1DM+C9jxYnfCc5wWBzdHteCDUJbTBZ6IaxfhgcA/23gehJ4zKoylpTawC4LFTDoF/CBoZ5A2C9AIRpL9L3+haFyFo05sQnPe8MWB80B0yB6Ce5bAjL+dWYYp/uNxUmEvmNIZEwfDBdFKyx3uHJVT6B2/M2FPwOZnJS+T4yx72PgURr/aIG6RI+U0guyBhjJjtV+mREaCf0q5CjTFpDG4cLr6XVbtYISd4vNZGF5MD26Wr5iImx66MGC1GYl0Dc4UlyPRprxh4vFkA2CRIa3Btkh/NcApsK72XUVH+c17EKEVoVuSpnT1iAJ9oeVXeFy2ynINXjMjiLCaGQtUi/7jxLLDHl/9BlYRWIitOGFrVpBTvGJg+PmFu04wxnGQmgogxn88XWiVVGBQI0iLabPQwWb661AsMg5FMNPGKERs9NQbl/xqse+dXfd4ee3aI5HM93bH1pXtW3+Y+XvXX7b/o9MVsUHhZEeF/PPampgejc4Q+FSd6jiZNQYWMBkoXVAjqEaIyyJp78HAcT1SUwoHgSkCUvlIEwiTH8TSpWVW0J5Qg8Lc1wfwP8C4lHW/ej9ocEAAAAASUVORK5CYII="/> */}

          {/* <div className={"cube w-5 h-5  "}>
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            
          </div> */}
         
          <div className={''}>
          <p className={'text-4xl text-bold text-center text-yellow-900 font-[alba] drop-shadow-md'}>Shofly <br/><span className={'text-yellow-400'}>Tawseel</span></p>
          </div>
          

        </div>
      </IonContent>

      {/* <IonLoading isOpen={true} message={TT("Please Wait")}/> */}
    </div>
  );
};

export default LoadingScreen;
