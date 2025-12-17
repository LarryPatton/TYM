import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTitle } from '../hooks/useTitle';
import { useClipboard } from '../hooks/useClipboard';

const Contact = () => {
  useTitle('联系');
  const { copiedId, copy } = useClipboard();
  const [formStatus, setFormStatus] = useState('idle'); // idle, submitting, success

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormStatus('submitting');
    // Simulate API call
    setTimeout(() => {
      setFormStatus('success');
    }, 1500);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 20px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '80px' }}>
        <h1 style={{ fontSize: '4em', fontWeight: '900', marginBottom: '20px' }}>联系.</h1>
        <p style={{ fontSize: '1.5em', color: '#666' }}>
          接受自由职业项目、咨询和全职工作机会。
        </p>
      </div>

      {/* Contact Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', marginBottom: '100px' }}>
        
        {/* Email Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          style={{ padding: '40px', background: '#f9f9f9', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <div>
            <h3 style={{ fontSize: '1.5em', fontWeight: 'bold', marginBottom: '10px' }}>邮箱</h3>
            <p style={{ color: '#666', marginBottom: '30px' }}>适合项目咨询和详细讨论。</p>
            <div style={{ fontSize: '1.2em', fontWeight: 'bold', marginBottom: '30px' }}>hello@example.com</div>
          </div>
          <div style={{ display: 'flex', gap: '15px' }}>
            <button 
              onClick={() => copy('hello@example.com', 'email')}
              style={{ padding: '10px 20px', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontWeight: '500', flex: 1 }}
            >
              {copiedId === 'email' ? '已复制!' : '复制邮箱'}
            </button>
            <a href="mailto:hello@example.com" style={{ flex: 1, textDecoration: 'none' }}>
              <button style={{ width: '100%', padding: '10px 20px', background: '#000', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}>
                发送邮件
              </button>
            </a>
          </div>
        </motion.div>

        {/* WeChat Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          style={{ padding: '40px', background: '#f9f9f9', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <div>
            <h3 style={{ fontSize: '1.5em', fontWeight: 'bold', marginBottom: '10px' }}>微信</h3>
            <p style={{ color: '#666', marginBottom: '30px' }}>适合快速沟通和建立联系。</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
              <div style={{ width: '100px', height: '100px', background: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '0.8em' }}>
                [ 二维码 ]
              </div>
              <div>
                <div style={{ fontSize: '0.9em', color: '#999', marginBottom: '5px' }}>微信号</div>
                <div style={{ fontSize: '1.2em', fontWeight: 'bold' }}>wx_username</div>
              </div>
            </div>
          </div>
          <div>
            <button 
              onClick={() => copy('wx_username', 'wechat')}
              style={{ width: '100%', padding: '10px 20px', background: '#fff', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' }}
            >
              {copiedId === 'wechat' ? '已复制 ID!' : '复制微信号'}
            </button>
          </div>
        </motion.div>
      </div>

      {/* Collaboration Form */}
      <div style={{ maxWidth: '700px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2em', fontWeight: 'bold', marginBottom: '40px', textAlign: 'center' }}>项目咨询</h2>
        
        {formStatus === 'success' ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ padding: '40px', background: '#e8f5e9', borderRadius: '16px', textAlign: 'center', color: '#2e7d32' }}
          >
            <h3 style={{ fontSize: '1.5em', marginBottom: '10px' }}>消息已发送!</h3>
            <p>感谢您的联系。我会在 24 小时内回复您。</p>
            <button 
              onClick={() => setFormStatus('idle')}
              style={{ marginTop: '20px', padding: '10px 20px', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
            >
              发送另一条
            </button>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>姓名</label>
                <input required type="text" style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #eee', background: '#f9f9f9', fontSize: '1em' }} placeholder="您的姓名" />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>邮箱</label>
                <input required type="email" style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #eee', background: '#f9f9f9', fontSize: '1em' }} placeholder="your@email.com" />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>项目类型</label>
                <select style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #eee', background: '#f9f9f9', fontSize: '1em' }}>
                  <option>网页设计与开发</option>
                  <option>移动应用设计</option>
                  <option>品牌设计</option>
                  <option>咨询</option>
                  <option>其他</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>预算范围</label>
                <select style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #eee', background: '#f9f9f9', fontSize: '1em' }}>
                  <option>&lt; ¥30k</option>
                  <option>¥30k - ¥60k</option>
                  <option>¥60k - ¥120k</option>
                  <option>&gt; ¥120k</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <label style={{ display: 'block', marginBottom: '10px', fontWeight: '500' }}>项目详情</label>
              <textarea required rows="6" style={{ width: '100%', padding: '15px', borderRadius: '8px', border: '1px solid #eee', background: '#f9f9f9', fontSize: '1em', fontFamily: 'inherit' }} placeholder="请告诉我您的目标、时间表以及任何具体要求..."></textarea>
            </div>

            <button 
              type="submit" 
              disabled={formStatus === 'submitting'}
              style={{ width: '100%', padding: '18px', background: '#000', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '1.1em', fontWeight: 'bold', cursor: formStatus === 'submitting' ? 'wait' : 'pointer', opacity: formStatus === 'submitting' ? 0.7 : 1 }}
            >
              {formStatus === 'submitting' ? '发送中...' : '发送消息'}
            </button>
          </form>
        )}
      </div>

    </div>
  );
};

export default Contact;