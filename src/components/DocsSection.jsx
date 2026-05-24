const docs = [
  {
    title: 'Jenkins Declarative Pipeline',
    category: 'CI/CD',
    color: '#D24939',
    code: `pipeline {
  agent any
  stages {
    stage('Build') {
      steps {
        sh 'mvn clean install'
      }
    }
    stage('Deploy') {
      steps {
        sh 'kubectl apply -f k8s/'
      }
    }
  }
}`,
  },
  {
    title: 'GitHub Actions Workflow',
    category: 'CI/CD',
    color: '#2DA44E',
    code: `name: Deploy to Production
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm ci && npm run build
      - run: kubectl apply -f k8s/`,
  },
  {
    title: 'Terraform AWS EC2',
    category: 'IaC',
    color: '#7B42BC',
    code: `resource "aws_instance" "web" {
  ami           = "ami-0c55b159cbfafe1f0"
  instance_type = "t3.micro"

  tags = {
    Name        = "WebServer"
    Environment = "production"
  }
}`,
  },
  {
    title: 'Ansible Deploy Playbook',
    category: 'Configuration',
    color: '#EE0000',
    code: `- name: Deploy Application
  hosts: production
  tasks:
    - name: Pull latest image
      docker_image:
        name: myapp:latest
        source: pull
    - name: Start container
      docker_container:
        name: myapp
        image: myapp:latest
        state: started`,
  },
];

export default function DocsSection() {
  return (
    <section style={{ padding: '6rem 2rem', maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ fontFamily: 'Space Mono', fontSize: 11, color: 'var(--accent)', letterSpacing: '0.1em', marginBottom: 12 }}>
          // QUICK REFERENCE
        </div>
        <h2 style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 'clamp(2rem,4vw,3rem)', letterSpacing: '-0.02em', marginBottom: '1rem' }}>
          Code Snippets
        </h2>
        <p style={{ color: 'var(--text-dim)', maxWidth: 480, margin: '0 auto' }}>
          Ready-to-use configuration templates for common scenarios
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))',
        gap: '1.5rem',
      }}>
        {docs.map(d => (
          <div key={d.title} style={{
            background: 'var(--bg2)', border: '1px solid var(--border)',
            borderRadius: 16, overflow: 'hidden',
          }}>
            {/* Header */}
            <div style={{
              padding: '14px 18px', background: 'var(--bg3)',
              borderBottom: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: d.color }} />
                <span style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 13 }}>{d.title}</span>
              </div>
              <span style={{
                fontSize: 10, color: d.color, fontFamily: 'Space Mono',
                padding: '2px 8px', borderRadius: 4,
                background: d.color + '18', border: `1px solid ${d.color}33`,
              }}>{d.category}</span>
            </div>
            {/* Code */}
            <pre style={{
              margin: 0, padding: '18px 20px',
              fontFamily: 'Space Mono', fontSize: 12,
              color: '#C9D1D9', lineHeight: 1.7,
              overflowX: 'auto',
              background: 'transparent',
            }}>
              <code>{d.code}</code>
            </pre>
          </div>
        ))}
      </div>
    </section>
  );
}
