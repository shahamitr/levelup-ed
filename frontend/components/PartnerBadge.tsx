import React from 'react';
import { Building2 } from 'lucide-react';

interface PartnerBadgeProps {
    partnerName: string;
    logoUrl?: string;
    tier?: 'premier' | 'standard' | 'community';
    size?: 'sm' | 'md' | 'lg';
}

export const PartnerBadge: React.FC<PartnerBadgeProps> = ({
    partnerName,
    logoUrl,
    tier = 'standard',
    size = 'md'
}) => {
    const sizeClasses = {
        sm: 'px-2 py-1 text-[10px]',
        md: 'px-3 py-1.5 text-xs',
        lg: 'px-4 py-2 text-sm'
    };

    const tierColors = {
        premier: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
        standard: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300',
        community: 'bg-slate-500/10 border-slate-500/30 text-slate-300'
    };

    const tierLabels = {
        premier: 'Premier Partner',
        standard: 'Partner',
        community: 'Community'
    };

    return (
        <div className={`inline-flex items-center space-x-2 rounded-full border ${tierColors[tier]} ${sizeClasses[size]}`}>
            {logoUrl ? (
                <img src={logoUrl} alt={partnerName} className="w-4 h-4 rounded-sm object-contain" />
            ) : (
                <Building2 size={size === 'sm' ? 12 : size === 'md' ? 14 : 16} />
            )}
            <span className="font-semibold tracking-tight">
                {tier === 'premier' && '⭐ '}
                {partnerName}
            </span>
            {tier === 'premier' && (
                <span className="text-[8px] uppercase tracking-widest opacity-70">{tierLabels[tier]}</span>
            )}
        </div>
    );
};

export default PartnerBadge;
