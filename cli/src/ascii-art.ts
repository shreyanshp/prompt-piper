export const ASCII_ART = {
  banner: `
╔═══════════════════════════════════════════════════════════════════════════════╗
║                                                                               ║
║   ██████╗ ██████╗  ██████╗ ███╗   ███╗██████╗ ████████╗                       ║
║   ██╔══██╗██╔══██╗██╔═══██╗████╗ ████║██╔══██╗╚══██╔══╝                       ║
║   ██████╔╝██████╔╝██║   ██║██╔████╔██║██████╔╝   ██║                          ║
║   ██╔═══╝ ██╔══██╗██║   ██║██║╚██╔╝██║██╔═══╝    ██║                          ║
║   ██║     ██║  ██║╚██████╔╝██║ ╚═╝ ██║██║        ██║                          ║
║   ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚═╝        ╚═╝                          ║
║                                                                               ║
║   ██████╗ ██╗██████╗ ███████╗██████╗                                          ║
║   ██╔══██╗██║██╔══██╗██╔════╝██╔══██╗                                         ║
║   ██████╔╝██║██████╔╝█████╗  ██████╔╝                                         ║
║   ██╔═══╝ ██║██╔═══╝ ██╔══╝  ██╔══██╗                                         ║
║   ██║     ██║██║     ███████╗██║  ██║                                         ║
║   ╚═╝     ╚═╝╚═╝     ╚══════╝╚═╝  ╚═╝                                         ║
║                                                                               ║
║   Compress AI prompts to reduce token usage and save costs                    ║
║                                                                               ║
╚═══════════════════════════════════════════════════════════════════════════════╝`,

  smallBanner: `
┌─────────────────────────────────────┐
│  PROMPT PIPER - Token Compression   │
└─────────────────────────────────────┘`,

  compression: `
  BEFORE                   AFTER
  ┌─────────┐              ┌─────┐
  │█████████│  ────────>   │█████│
  │█████████│              └─────┘
  │█████████│
  └─────────┘              33% smaller!`,

  tokenBar: (percentage: number): string => {
    const width = 40;
    const filled = Math.round((percentage / 100) * width);
    const empty = width - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
  },

  box: (content: string, title?: string): string => {
    const lines = content.split('\n');
    const maxLength = Math.max(...lines.map(l => l.length), title?.length || 0);
    const width = maxLength + 4;

    let box = '┌' + '─'.repeat(width - 2) + '┐\n';

    if (title) {
      const padding = Math.floor((width - title.length - 2) / 2);
      box += '│' + ' '.repeat(padding) + title + ' '.repeat(width - padding - title.length - 2) + '│\n';
      box += '├' + '─'.repeat(width - 2) + '┤\n';
    }

    lines.forEach(line => {
      const padding = width - line.length - 2;
      box += '│ ' + line + ' '.repeat(padding - 1) + '│\n';
    });

    box += '└' + '─'.repeat(width - 2) + '┘';

    return box;
  },

  divider: (width: number = 50, style: 'single' | 'double' | 'thick' = 'single'): string => {
    const chars = {
      single: '─',
      double: '═',
      thick: '━'
    };
    return chars[style].repeat(width);
  },

  arrow: {
    right: '────>',
    left: '<────',
    both: '<────>',
    fancy: '────►',
    double: '────»'
  },

  icons: {
    success: '[✓]',
    error: '[✗]',
    warning: '[!]',
    info: '[i]',
    money: '[$]',
    stats: '[#]',
    input: '[<]',
    output: '[>]',
    star: '[*]',
    plus: '[+]',
    minus: '[-]'
  }
};