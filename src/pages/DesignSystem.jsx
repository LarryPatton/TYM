import React from 'react';

const DesignSystem = () => {
  return (
    <div style={{ padding: '100px 40px', background: 'var(--color-bg)', color: 'var(--color-text-main)', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '20px' }}>Design System</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--color-text-muted)', marginBottom: '80px' }}>
          A unified monochrome design language for the portfolio.
        </p>

        {/* 1. Colors */}
        <section style={{ marginBottom: 'var(--space-4xl)' }}>
          <h2 style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-md)', marginBottom: 'var(--space-xl)', fontFamily: 'var(--font-serif)', fontSize: 'var(--text-h2)' }}>01. Colors</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 'var(--space-lg)' }}>
            {[
              { name: '--color-bg', value: '#ffffff', hex: '#ffffff' },
              { name: '--color-bg-subtle', value: '#fafafa', hex: '#fafafa' },
              { name: '--color-bg-alt', value: '#f5f5f5', hex: '#f5f5f5' },
              { name: '--color-text-main', value: '#111111', hex: '#111111' },
              { name: '--color-text-muted', value: '#666666', hex: '#666666' },
              { name: '--color-text-light', value: '#999999', hex: '#999999' },
              { name: '--color-border', value: '#eaeaea', hex: '#eaeaea' },
              { name: '--color-border-hover', value: '#cccccc', hex: '#cccccc' },
            ].map(color => (
              <div key={color.name} style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
                <div style={{ height: '120px', background: `var(${color.name})`, borderBottom: '1px solid var(--color-border)' }} />
                <div style={{ padding: 'var(--space-md)' }}>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px', fontFamily: 'var(--font-sans)' }}>{color.name}</div>
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)', fontFamily: 'monospace' }}>{color.hex}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Typography */}
        <section style={{ marginBottom: 'var(--space-4xl)' }}>
          <h2 style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-md)', marginBottom: 'var(--space-xl)', fontFamily: 'var(--font-serif)', fontSize: 'var(--text-h2)' }}>02. Typography</h2>
          
          <div style={{ marginBottom: 'var(--space-3xl)' }}>
            <h3 style={{ fontSize: 'var(--text-h3)', marginBottom: 'var(--space-lg)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-sans)' }}>Font Families</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-xl)' }}>
              <div>
                <div style={{ fontSize: 'var(--text-h1)', fontFamily: 'var(--font-serif)', lineHeight: 'var(--line-height-tight)' }}>Ag</div>
                <div style={{ marginTop: 'var(--space-sm)', fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>var(--font-serif)</div>
                <div style={{ marginTop: 'var(--space-xs)', fontFamily: 'var(--font-sans)' }}>Playfair Display</div>
              </div>
              <div>
                <div style={{ fontSize: 'var(--text-h1)', fontFamily: 'var(--font-sans)', lineHeight: 'var(--line-height-tight)' }}>Ag</div>
                <div style={{ marginTop: 'var(--space-sm)', fontFamily: 'monospace', color: 'var(--color-text-muted)' }}>var(--font-sans)</div>
                <div style={{ marginTop: 'var(--space-xs)', fontFamily: 'var(--font-sans)' }}>Inter</div>
              </div>
            </div>
          </div>

          <div>
            <h3 style={{ fontSize: 'var(--text-h3)', marginBottom: 'var(--space-lg)', color: 'var(--color-text-muted)', fontFamily: 'var(--font-sans)' }}>Scale</h3>
            {[
              { label: 'Display', size: 'var(--text-display)', weight: 400, font: 'var(--font-serif)' },
              { label: 'H1', size: 'var(--text-h1)', weight: 400, font: 'var(--font-serif)' },
              { label: 'H2', size: 'var(--text-h2)', weight: 400, font: 'var(--font-sans)' },
              { label: 'H3', size: 'var(--text-h3)', weight: 400, font: 'var(--font-sans)' },
              { label: 'Body Large', size: 'var(--text-body-lg)', weight: 400, font: 'var(--font-sans)' },
              { label: 'Body Base', size: 'var(--text-body)', weight: 400, font: 'var(--font-sans)' },
              { label: 'Caption', size: 'var(--text-sm)', weight: 400, font: 'var(--font-sans)' },
              { label: 'Tiny', size: 'var(--text-xs)', weight: 400, font: 'var(--font-sans)' },
            ].map((type, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'baseline', borderBottom: '1px solid var(--color-border)', padding: 'var(--space-md) 0' }}>
                <div style={{ width: '150px', color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-sans)' }}>{type.label}</div>
                <div style={{ fontSize: type.size, fontWeight: type.weight, fontFamily: type.font }}>
                  The quick brown fox jumps over the lazy dog.
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Radius & Shadows */}
        <section style={{ marginBottom: 'var(--space-4xl)' }}>
          <h2 style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-md)', marginBottom: 'var(--space-xl)', fontFamily: 'var(--font-serif)', fontSize: 'var(--text-h2)' }}>03. Radius & Shadows</h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 'var(--space-xl)' }}>
            {[
              { name: '--radius-sm', value: '4px' },
              { name: '--radius-md', value: '8px' },
              { name: '--radius-lg', value: '16px' },
              { name: '--radius-xl', value: '24px' },
              { name: '--radius-full', value: '9999px' },
            ].map(radius => (
              <div key={radius.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ 
                  width: '120px', 
                  height: '120px', 
                  background: 'var(--color-bg-subtle)', 
                  border: '1px solid var(--color-text-main)', 
                  borderRadius: `var(${radius.name})`,
                  marginBottom: 'var(--space-md)'
                }} />
                <div style={{ fontFamily: 'monospace', fontSize: 'var(--text-sm)' }}>{radius.name}</div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 'var(--space-3xl)', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 'var(--space-xl)' }}>
            {[
              { name: '--shadow-sm' },
              { name: '--shadow-md' },
              { name: '--shadow-lg' },
              { name: '--shadow-xl' },
              { name: '--shadow-hover' },
            ].map(shadow => (
              <div key={shadow.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ 
                  width: '120px', 
                  height: '120px', 
                  background: '#fff', 
                  borderRadius: 'var(--radius-md)',
                  boxShadow: `var(${shadow.name})`,
                  marginBottom: 'var(--space-md)'
                }} />
                <div style={{ fontFamily: 'monospace', fontSize: 'var(--text-sm)' }}>{shadow.name}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 4. UI Components */}
        <section>
          <h2 style={{ borderBottom: '1px solid var(--color-border)', paddingBottom: 'var(--space-md)', marginBottom: 'var(--space-xl)', fontFamily: 'var(--font-serif)', fontSize: 'var(--text-h2)' }}>04. UI Components</h2>
          
          <div style={{ display: 'flex', gap: 'var(--space-lg)', flexWrap: 'wrap', marginBottom: 'var(--space-xl)' }}>
            <button style={{ 
              padding: '12px 30px', 
              background: 'var(--color-text-main)', 
              color: 'var(--color-bg)', 
              border: 'none', 
              borderRadius: 'var(--radius-full)', 
              fontSize: 'var(--text-body)', 
              fontWeight: '500',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)'
            }}>
              Primary Button
            </button>
            
            <button style={{ 
              padding: '12px 30px', 
              background: 'transparent', 
              color: 'var(--color-text-main)', 
              border: '1px solid var(--color-border)', 
              borderRadius: 'var(--radius-full)', 
              fontSize: 'var(--text-body)', 
              fontWeight: '500',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)'
            }}>
              Secondary Button
            </button>

            <button style={{ 
              padding: '12px 30px', 
              background: 'var(--color-bg-subtle)', 
              color: 'var(--color-text-muted)', 
              border: 'none', 
              borderRadius: 'var(--radius-full)', 
              fontSize: 'var(--text-body)', 
              fontWeight: '500',
              cursor: 'not-allowed',
              fontFamily: 'var(--font-sans)'
            }}>
              Disabled
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-xl)' }}>
            <div style={{ 
              padding: 'var(--space-xl)', 
              background: '#fff', 
              borderRadius: 'var(--radius-lg)', 
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--color-border)'
            }}>
              <h3 style={{ marginTop: 0, fontFamily: 'var(--font-serif)', fontSize: 'var(--text-h3)' }}>Card Component</h3>
              <p style={{ color: 'var(--color-text-muted)', fontFamily: 'var(--font-sans)', lineHeight: 'var(--line-height-base)' }}>This is a standard card component using the design system tokens.</p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default DesignSystem;