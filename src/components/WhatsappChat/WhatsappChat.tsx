import Florencia from '../../assets/images/site/about.jpeg'
import GoBack from '../../assets/icons/arrow-left.svg'
import Options from '../../assets/icons/options.svg'
import DoubleCheck from '../../assets/icons/double-check.svg'
import Smiley from '../../assets/icons/smiley.svg'
import Send from '../../assets/icons/send.svg'

type Props = {}

export default function WhatsappChat({ }: Props) {
    return (
        <div className="whatsappchat__container">
            <div className="whatsapp__box">
                <div className="whatsapp__header">
                    <img src={GoBack} alt="" className="whatsapp__header-goback" />
                    <img src={Florencia} alt="" className="whatsapp__header-img" />
                    <div className="whatsapp__header-text">
                        <p className="whatsapp__header-name">Lic. Florencia Bernero</p>
                        <p className="whatsapp__header-status">Online</p>
                    </div>
                    <img src={Options} alt="" className="whatsapp__header-options" />
                </div>

                <div className="whatsapp__chat">
                    <div className="whatsapp__chat-message">
                        <p className="whatsapp__chat-message-text"></p>
                        <div className="whatsapp__chat-message-status">
                            <p className="whatsapp__chat-message-time">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                            <img src={DoubleCheck} alt="" className="whatsapp__chat-message-check" />
                        </div>
                    </div>
                </div>

                <div className="whatsapp__footer">
                    <div className="whatsapp__input">
                        <img src={Smiley} alt="" className="whatsapp__input-emojis" />
                        <input type="text" className="whatsapp__input-box" />
                    </div>
                    <div className="whatsapp__send-container">
                        <img src={Send} alt="" className="whatsapp__send-svg" />
                    </div>
                </div>
            </div>
        </div>
    )
}