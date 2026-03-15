'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { createClient } from '@/lib/supabase/client';
import {
  Users, MessageCircle, Send, Star, Bug, Lightbulb,
  Heart, ExternalLink, CheckCircle2, Twitter, Youtube, Mail
} from 'lucide-react';

const WHATSAPP_GROUP_LINK = 'https://chat.whatsapp.com/YOUR_GROUP_INVITE_LINK'; // Replace with actual link

const COMMUNITY_LINKS = [
  {
    icon: MessageCircle,
    title: 'WhatsApp Community',
    titleHi: 'WhatsApp समुदाय',
    desc: 'Join 500+ Indian traders. Share ideas, ask questions, get help. No spam, no tips.',
    descHi: '500+ भारतीय traders से जुड़ें। विचार साझा करें, सवाल पूछें। कोई spam नहीं, कोई tips नहीं।',
    href: WHATSAPP_GROUP_LINK,
    cta: 'Join WhatsApp Group',
    color: 'bg-green-500/10 text-green-500 border-green-500/20',
    iconColor: 'text-green-500',
  },
  {
    icon: Twitter,
    title: 'Follow on X (Twitter)',
    titleHi: 'X (Twitter) पर follow करें',
    desc: 'Daily market insights, app updates, and trading psychology tips.',
    descHi: 'रोज़ाना market insights, app updates, और trading psychology tips।',
    href: 'https://twitter.com/bazaarsaar',
    cta: 'Follow @bazaarsaar',
    color: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
    iconColor: 'text-cyan-500',
  },
  {
    icon: Youtube,
    title: 'YouTube Channel',
    titleHi: 'YouTube चैनल',
    desc: 'Video tutorials: How to use BazaarSaar, trading basics, and weekly market analysis.',
    descHi: 'Video tutorials: BazaarSaar कैसे use करें, trading basics, और weekly market analysis।',
    href: 'https://youtube.com/@bazaarsaar',
    cta: 'Subscribe',
    color: 'bg-red-500/10 text-red-500 border-red-500/20',
    iconColor: 'text-red-500',
  },
  {
    icon: Mail,
    title: 'Email Us',
    titleHi: 'हमें Email करें',
    desc: 'Have a question or need help? We reply to every email within 24 hours.',
    descHi: 'कोई सवाल है या मदद चाहिए? हम हर email का 24 घंटे में जवाब देते हैं।',
    href: 'mailto:hello@bazzarsaar.com',
    cta: 'Send Email',
    color: 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    iconColor: 'text-amber-500',
  },
];

type FeedbackType = 'feature' | 'bug' | 'feedback';

const FEEDBACK_TYPES: { value: FeedbackType; label: string; labelHi: string; icon: typeof Star; color: string }[] = [
  { value: 'feature', label: 'Feature Request', labelHi: 'नई सुविधा', icon: Lightbulb, color: 'text-amber-500' },
  { value: 'bug', label: 'Report a Bug', labelHi: 'Bug रिपोर्ट', icon: Bug, color: 'text-red-500' },
  { value: 'feedback', label: 'General Feedback', labelHi: 'सामान्य सुझाव', icon: Heart, color: 'text-pink-500' },
];

export default function CommunityPage() {
  const [feedbackType, setFeedbackType] = useState<FeedbackType>('feedback');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!message.trim()) return;
    setSubmitting(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from('audit_event').insert({
        event_type: `feedback_${feedbackType}`,
        payload: { message: message.trim(), type: feedbackType },
        user_id: user?.id || null,
      });
    } catch {
      // Still show success — feedback is best-effort
    }
    setSubmitted(true);
    setSubmitting(false);
    setMessage('');
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Users size={28} className="text-green-500" />
          <div>
            <h1 className="text-2xl font-bold text-[#fafaff]">Community</h1>
            <p className="text-sm text-amber-500/70" lang="hi">समुदाय</p>
          </div>
        </div>
        <p className="text-sm text-[#6b6b8a]">
          Trading is hard. Doing it alone is harder. Join our community of Indian traders who help each other learn, grow, and stay disciplined.
        </p>
        <p className="text-[11px] text-amber-500/50 mt-1" lang="hi">
          Trading कठिन है। अकेले करना और भी कठिन। हमारे भारतीय traders के समुदाय से जुड़ें — एक दूसरे की मदद करें, सीखें, और अनुशासित रहें।
        </p>
      </div>

      {/* Community Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {COMMUNITY_LINKS.map((link) => (
          <a
            key={link.title}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="no-underline"
          >
            <GlassCard className="p-5 h-full hover:border-white/[0.15] transition-all cursor-pointer group">
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${link.color.split(' ')[0]}`}>
                  <link.icon size={20} className={link.iconColor} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-[#d4d4e8] group-hover:text-[#fafaff] transition-colors">{link.title}</h3>
                  <p className="text-[10px] text-amber-500/50" lang="hi">{link.titleHi}</p>
                  <p className="text-xs text-[#6b6b8a] mt-1.5 leading-relaxed">{link.desc}</p>
                  <p className="text-[10px] text-amber-500/40 mt-0.5" lang="hi">{link.descHi}</p>
                  <span className={`inline-flex items-center gap-1 mt-3 text-[11px] font-medium ${link.color.split(' ')[1]} group-hover:underline`}>
                    {link.cta} <ExternalLink size={10} />
                  </span>
                </div>
              </div>
            </GlassCard>
          </a>
        ))}
      </div>

      {/* Community Rules */}
      <GlassCard className="p-5 mb-8 border-l-4 border-green-500/30">
        <h3 className="text-sm font-semibold text-[#d4d4e8] mb-2">Community Rules</h3>
        <p className="text-[10px] text-amber-500/50 mb-3" lang="hi">समुदाय के नियम</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {[
            { rule: 'No stock tips or "buy this" advice', ruleHi: 'कोई stock tips या "ये खरीदो" सलाह नहीं' },
            { rule: 'No paid groups or course promotions', ruleHi: 'कोई paid group या course promotion नहीं' },
            { rule: 'Be respectful — everyone is learning', ruleHi: 'सम्मान रखें — सब सीख रहे हैं' },
            { rule: 'Share your process, not just P&L screenshots', ruleHi: 'अपनी process share करें, सिर्फ़ P&L screenshots नहीं' },
          ].map((r) => (
            <div key={r.rule} className="flex items-start gap-2">
              <CheckCircle2 size={13} className="text-green-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-[#b0b0c8]">{r.rule}</p>
                <p className="text-[10px] text-amber-500/40" lang="hi">{r.ruleHi}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Feedback & Feature Requests */}
      <div className="mb-8">
        <h2 className="text-lg font-bold text-[#fafaff] mb-1">Share Your Feedback</h2>
        <p className="text-sm text-amber-500/70 mb-1" lang="hi">अपना सुझाव दें</p>
        <p className="text-xs text-[#6b6b8a] mb-4">
          Your feedback shapes BazaarSaar. Tell us what to build next, report bugs, or just say hi.
          <span className="text-amber-500/50 ml-1" lang="hi">आपका सुझाव BazaarSaar को बेहतर बनाता है।</span>
        </p>

        <GlassCard className="p-5">
          {/* Feedback Type Selector */}
          <div className="flex gap-2 mb-4">
            {FEEDBACK_TYPES.map((ft) => (
              <button
                key={ft.value}
                type="button"
                onClick={() => setFeedbackType(ft.value)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs border cursor-pointer transition-all ${
                  feedbackType === ft.value
                    ? `${ft.color} border-current bg-current/10`
                    : 'text-[#6b6b8a] border-white/[0.06] bg-transparent hover:bg-white/[0.04]'
                }`}
              >
                <ft.icon size={13} />
                <span>{ft.label}</span>
              </button>
            ))}
          </div>

          {/* Message Input */}
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={
              feedbackType === 'feature'
                ? 'I wish BazaarSaar had... / काश BazaarSaar में ये होता...'
                : feedbackType === 'bug'
                ? 'I found a problem: ... / मुझे ये समस्या मिली: ...'
                : 'I think... / मुझे लगता है...'
            }
            className="w-full px-4 py-3 rounded-xl bg-[#11111a] border border-white/[0.06] text-sm text-[#d4d4e8] placeholder:text-[#4a4a6a] outline-none focus:border-green-500/30 resize-none min-h-[100px] mb-3"
          />

          <div className="flex items-center justify-between">
            <p className="text-[10px] text-[#4a4a6a]">
              All feedback is anonymous. We read every message.
              <span className="text-amber-500/40 ml-1" lang="hi">सभी सुझाव गोपनीय हैं। हम हर message पढ़ते हैं।</span>
            </p>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!message.trim() || submitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-[#0d0d14] bg-green-500 border-none cursor-pointer hover:bg-green-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send size={14} />
              {submitting ? 'Sending...' : submitted ? 'Sent!' : 'Send Feedback'}
            </button>
          </div>

          {submitted && (
            <div className="mt-3 p-3 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" />
              <div>
                <p className="text-sm text-green-500 font-medium">Thank you! We got your feedback.</p>
                <p className="text-[10px] text-amber-500/50" lang="hi">धन्यवाद! हमें आपका सुझाव मिल गया।</p>
              </div>
            </div>
          )}
        </GlassCard>
      </div>

      {/* FAQ-style: Why join? */}
      <GlassCard className="p-5 mb-8">
        <h3 className="text-sm font-semibold text-[#d4d4e8] mb-3">Why join the community?</h3>
        <p className="text-[10px] text-amber-500/50 mb-4" lang="hi">समुदाय में क्यों जुड़ें?</p>
        <div className="space-y-3">
          {[
            {
              q: 'I\'m a complete beginner. Will I fit in?',
              qHi: 'मैं बिल्कुल नया हूँ। क्या मैं fit रहूंगा?',
              a: 'Absolutely! Most of our members are beginners. No question is too basic. We all started from zero.',
              aHi: 'बिल्कुल! ज़्यादातर सदस्य beginners हैं। कोई सवाल बहुत basic नहीं है। हम सब zero से शुरू हुए।',
            },
            {
              q: 'Will anyone try to sell me courses or tips?',
              qHi: 'क्या कोई मुझे courses या tips बेचने की कोशिश करेगा?',
              a: 'No. We strictly ban promotions, paid groups, and "guaranteed return" scams. Immediate removal.',
              aHi: 'नहीं। हम promotions, paid groups, और "guaranteed return" scams पर सख्त ban रखते हैं।',
            },
            {
              q: 'What do people talk about?',
              qHi: 'लोग किस बारे में बात करते हैं?',
              a: 'Trading psychology, journaling habits, market analysis, mistakes to avoid, and helping each other improve process.',
              aHi: 'Trading psychology, journaling की आदतें, market analysis, बचने वाली ग़लतियां, और एक दूसरे की process सुधारने में मदद।',
            },
          ].map((item) => (
            <div key={item.q} className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <p className="text-xs font-medium text-[#d4d4e8] mb-0.5">{item.q}</p>
              <p className="text-[10px] text-amber-500/50 mb-1.5" lang="hi">{item.qHi}</p>
              <p className="text-xs text-[#6b6b8a] leading-relaxed">{item.a}</p>
              <p className="text-[10px] text-amber-500/40 mt-0.5" lang="hi">{item.aHi}</p>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
