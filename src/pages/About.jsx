import Guestbook from '../components/Guestbook';

export default function About() {
  return (
    <div className="container">
      <h1 className="page-title">Jangmi Yoon</h1>
      <div className="page-content">
        <p>who continues to walk despite the fear<br/>
          and builds things along the way
        </p>
        <a href="mailto:hey@yoonjang.me" className="email-link">hey@yoonjang.me</a> | <a href="https://instagram.com/asaucybloom" target="_blank" rel="noopener noreferrer">
          IG asaucybloom
        </a>
        <p>재밌는 일 있으면 좀 알려주세요. 재미없어도 ↓ Tell me if something fun or silly comes up.</p>
      </div>

      {/* Guestbook */}
      <Guestbook />
    </div>
  );
}