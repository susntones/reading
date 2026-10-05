/* global hexo */
// {% reward %}：在正文任意位置插入打赏块，收款码取自 _config.next.yml 的 reward。
// 用 <details> 展开，避免与 NexT 只绑定第一个 .reward-container button 的脚本冲突。
'use strict';

const LABELS = { wechatpay: '微信', alipay: '支付宝', paypal: 'PayPal', bitcoin: '比特币' };

hexo.extend.tag.register('reward', function() {
  const url_for = hexo.extend.helper.get('url_for').bind(hexo);
  const theme = hexo.theme.config;
  const comment = (theme.reward_settings && theme.reward_settings.comment) || '';
  const items = Object.entries(theme.reward || {}).map(([name, image]) => {
    const label = LABELS[name] || name;
    return `<div><img src="${url_for(image)}" alt="${label}"><span>${label}</span></div>`;
  }).join('');
  return `<details class="reward-inline"><summary>${comment ? `<div>${comment}</div>` : ''}`
    + `<span class="reward-inline-btn">赞赏</span></summary><div class="reward-inline-qr">${items}</div></details>`;
});
