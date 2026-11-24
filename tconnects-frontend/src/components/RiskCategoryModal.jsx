import React, { useEffect } from 'react';
import './RiskCategoryModal.css';

const RiskCategoryModal = ({ category, onClose, onNavigate }) => {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  // Risk category data - mapping display names to filter values
  const categoryMapping = {
    'Credit Risk': 'Credit Risk',
    'Market Risk': 'Market Risk',
    'Operational Risk': 'Operational Risk',
    'Enterprise Risk': 'Enterprise Risk Management',
    'Compliance Risk': 'Regulatory & Compliance',
    'Technology Risk': 'Cybersecurity Risk',
    'Environmental Risk': 'Strategic Risk',
    'Human Capital Risk': 'Enterprise Risk Management',
    'Financial Risk': 'Liquidity Risk',
    'Strategic Risk': 'Strategic Risk'
  };

  const riskData = {
    'Credit Risk': {
      icon: '🛡️',
      title: 'Credit Risk',
      description: 'Credit risk is the potential loss arising from a borrower\'s failure to repay a loan or meet contractual obligations.',
      keyPoints: [
        'Assessment of borrower creditworthiness',
        'Default probability analysis',
        'Credit scoring and rating methodologies',
        'Portfolio diversification strategies',
        'Collateral evaluation and management'
      ],
      careers: [
        'Credit Risk Analyst',
        'Credit Risk Manager',
        'Portfolio Risk Manager',
        'Credit Underwriter'
      ]
    },
    'Market Risk': {
      icon: '📈',
      title: 'Market Risk',
      description: 'Market risk refers to the potential for financial losses due to fluctuations in market prices, including interest rates, exchange rates, and equity prices.',
      keyPoints: [
        'Value at Risk (VaR) calculations',
        'Stress testing and scenario analysis',
        'Trading book risk management',
        'Interest rate risk measurement',
        'Foreign exchange exposure management'
      ],
      careers: [
        'Market Risk Analyst',
        'Quantitative Risk Analyst',
        'Trading Risk Manager',
        'ALM Manager'
      ]
    },
    'Operational Risk': {
      icon: '⚙️',
      title: 'Operational Risk',
      description: 'Operational risk is the risk of loss resulting from inadequate or failed internal processes, people, systems, or external events.',
      keyPoints: [
        'Process risk identification and assessment',
        'Business continuity planning',
        'Fraud detection and prevention',
        'Technology and cybersecurity risk',
        'Human error mitigation strategies'
      ],
      careers: [
        'Operational Risk Manager',
        'Risk Control Officer',
        'Business Continuity Manager',
        'Fraud Risk Analyst'
      ]
    },
    'Enterprise Risk': {
      icon: '🏢',
      title: 'Enterprise Risk Management',
      description: 'Enterprise risk management (ERM) is a holistic approach to identifying, assessing, and managing all risks across an organization.',
      keyPoints: [
        'Strategic risk alignment',
        'Risk appetite framework development',
        'Board-level risk reporting',
        'Integrated risk assessment',
        'Risk culture enhancement'
      ],
      careers: [
        'Chief Risk Officer',
        'ERM Manager',
        'Strategic Risk Advisor',
        'Risk Governance Specialist'
      ]
    },
    'Compliance Risk': {
      icon: '✍️',
      title: 'Compliance Risk',
      description: 'Compliance risk is the potential for legal or regulatory sanctions, financial losses, or reputational damage from failing to comply with laws and regulations.',
      keyPoints: [
        'Regulatory change management',
        'Anti-money laundering (AML) compliance',
        'Know Your Customer (KYC) procedures',
        'Policy and procedure development',
        'Regulatory reporting and filings'
      ],
      careers: [
        'Compliance Officer',
        'Regulatory Affairs Manager',
        'AML Analyst',
        'Compliance Risk Manager'
      ]
    },
    'Technology Risk': {
      icon: '💻',
      title: 'Technology Risk',
      description: 'Technology risk encompasses cybersecurity threats, IT system failures, data breaches, and technology infrastructure vulnerabilities.',
      keyPoints: [
        'Cybersecurity threat assessment',
        'IT infrastructure resilience',
        'Data privacy and protection',
        'Third-party vendor risk management',
        'Disaster recovery planning'
      ],
      careers: [
        'IT Risk Manager',
        'Cybersecurity Risk Analyst',
        'Information Security Officer',
        'Technology Risk Consultant'
      ]
    },
    'Environmental Risk': {
      icon: '🌍',
      title: 'Environmental & Climate Risk',
      description: 'Environmental risk involves potential losses from environmental factors, including climate change, natural disasters, and sustainability issues.',
      keyPoints: [
        'Climate scenario analysis',
        'ESG (Environmental, Social, Governance) integration',
        'Carbon footprint assessment',
        'Sustainable finance frameworks',
        'Physical and transition risk modeling'
      ],
      careers: [
        'ESG Risk Analyst',
        'Climate Risk Manager',
        'Sustainability Risk Officer',
        'Green Finance Specialist'
      ]
    },
    'Human Capital Risk': {
      icon: '🧑‍🤝‍🧑',
      title: 'Human Capital Risk',
      description: 'Human capital risk relates to the potential for losses due to employee-related issues, including talent retention, skills gaps, and workforce management.',
      keyPoints: [
        'Talent retention strategies',
        'Succession planning',
        'Skills gap analysis',
        'Employee misconduct prevention',
        'Culture and conduct risk'
      ],
      careers: [
        'HR Risk Manager',
        'People Risk Analyst',
        'Talent Management Officer',
        'Conduct Risk Manager'
      ]
    },
    'Financial Risk': {
      icon: '🏦',
      title: 'Financial Risk',
      description: 'Financial risk encompasses various risks affecting an organization\'s financial health, including liquidity, credit, and capital adequacy risks.',
      keyPoints: [
        'Liquidity risk management',
        'Capital adequacy assessment',
        'Financial modeling and forecasting',
        'Balance sheet optimization',
        'Treasury risk management'
      ],
      careers: [
        'Financial Risk Analyst',
        'Treasury Risk Manager',
        'Capital Management Officer',
        'Liquidity Risk Manager'
      ]
    },
    'Strategic Risk': {
      icon: '🚀',
      title: 'Strategic Risk',
      description: 'Strategic risk involves potential losses from poor business decisions, inadequate execution of strategies, or failure to adapt to market changes.',
      keyPoints: [
        'Business strategy evaluation',
        'Competitive intelligence analysis',
        'Market disruption assessment',
        'Merger and acquisition risk',
        'Strategic planning alignment'
      ],
      careers: [
        'Strategic Risk Manager',
        'Business Strategy Analyst',
        'Corporate Development Officer',
        'Strategic Planning Manager'
      ]
    }
  };

  const data = riskData[category];

  if (!data) return null;

  const handleExploreJobs = () => {
    console.log('🔍 Exploring jobs for category:', category);
    console.log('📍 onNavigate function available:', !!onNavigate);
    
    // Close the modal first
    onClose();
    
    // Use the onNavigate prop passed from parent
    if (onNavigate) {
      const filterCategory = categoryMapping[category] || 'All Categories';
      console.log('✅ Navigating to jobsList with category:', filterCategory);
      
      // Small delay to ensure modal closes smoothly
      setTimeout(() => {
        onNavigate('jobsList', { selectedCategory: filterCategory });
      }, 100);
    } else {
      console.error('❌ onNavigate function not provided to RiskCategoryModal');
    }
  };

  return (
    <div className="risk-modal-overlay" onClick={onClose}>
      <div className="risk-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className="risk-modal-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        {/* Header */}
        <div className="risk-modal-header">
          <span className="risk-modal-icon">{data.icon}</span>
          <h2 className="risk-modal-title">{data.title}</h2>
        </div>

        {/* Description */}
        <p className="risk-modal-description">{data.description}</p>

        {/* Key Points */}
        <div className="risk-modal-section">
          <h3 className="risk-modal-section-title">Key Focus Areas</h3>
          <ul className="risk-modal-list">
            {data.keyPoints.map((point, index) => (
              <li key={index} className="risk-modal-list-item">
                <span className="list-bullet">•</span>
                {point}
              </li>
            ))}
          </ul>
        </div>

        {/* Career Opportunities */}
        <div className="risk-modal-section">
          <h3 className="risk-modal-section-title">Career Opportunities</h3>
          <div className="risk-modal-careers">
            {data.careers.map((career, index) => (
              <span key={index} className="career-badge">
                {career}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="risk-modal-footer">
          <button
            className="risk-modal-btn"
            onClick={handleExploreJobs}
          >
            Explore Jobs in {data.title}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RiskCategoryModal;