import React, { useState, useRef } from 'react';
import { X, Download, Share2, Linkedin, CheckCircle, QrCode, Award, Building2 } from 'lucide-react';

interface CertificateData {
    id: string;
    certificateNumber: string;
    recipientName: string;
    courseName: string;
    issueDate: string;
    skills: string[];
    verificationUrl: string;
    partner?: {
        name: string;
        logoUrl: string;
    } | null;
}

interface CertificateViewProps {
    certificate: CertificateData;
    onClose: () => void;
}

export const CertificateView: React.FC<CertificateViewProps> = ({ certificate, onClose }) => {
    const [downloading, setDownloading] = useState(false);
    const certRef = useRef<HTMLDivElement>(null);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleDownloadPDF = async () => {
        setDownloading(true);
        // In production, this would call the backend PDF generation endpoint
        // For now, we'll use browser print functionality
        const printWindow = window.open('', '_blank');
        if (printWindow && certRef.current) {
            printWindow.document.write(`
        <html>
          <head>
            <title>Certificate - ${certificate.courseName}</title>
            <style>
              body { font-family: 'Arial', sans-serif; margin: 0; padding: 40px; }
              .cert-container { border: 4px double #4f46e5; padding: 60px; text-align: center; }
              h1 { color: #1e1b4b; font-size: 36px; margin-bottom: 10px; }
              h2 { color: #4f46e5; font-size: 28px; margin: 20px 0; }
              .name { font-size: 32px; font-weight: bold; color: #1e1b4b; margin: 30px 0; }
              .course { font-size: 24px; color: #4f46e5; margin: 20px 0; }
              .skills { font-size: 14px; color: #64748b; margin: 20px 0; }
              .footer { margin-top: 40px; font-size: 12px; color: #94a3b8; }
            </style>
          </head>
          <body>
            <div class="cert-container">
              <h1>CERTIFICATE OF COMPLETION</h1>
              <p>This certifies that</p>
              <p class="name">${certificate.recipientName}</p>
              <p>has successfully completed the program</p>
              <p class="course">${certificate.courseName}</p>
              <p class="skills">Skills: ${certificate.skills.join(', ')}</p>
              <div class="footer">
                <p>Issue Date: ${formatDate(certificate.issueDate)}</p>
                <p>Certificate #: ${certificate.certificateNumber}</p>
                ${certificate.partner ? `<p>In partnership with ${certificate.partner.name}</p>` : ''}
              </div>
            </div>
          </body>
        </html>
      `);
            printWindow.document.close();
            printWindow.print();
        }
        setDownloading(false);
    };

    const handleShareLinkedIn = () => {
        const title = `I just earned a certificate in ${certificate.courseName}!`;
        const summary = `Verified my skills in ${certificate.skills.slice(0, 3).join(', ')} through LevelUpEd.`;
        const url = encodeURIComponent(certificate.verificationUrl);

        const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(summary)}`;
        window.open(linkedInUrl, '_blank', 'width=600,height=600');
    };

    return (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-slate-900 border border-slate-700 rounded-[3rem] max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-8 border-b border-slate-800">
                    <div className="flex items-center space-x-4">
                        <div className="p-3 bg-indigo-600/20 rounded-2xl">
                            <Award size={28} className="text-indigo-400" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white tracking-tight">Certificate</h2>
                            <p className="text-slate-500 text-sm font-mono">#{certificate.certificateNumber}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-3 hover:bg-slate-800 rounded-xl transition-colors"
                    >
                        <X size={24} className="text-slate-400" />
                    </button>
                </div>

                {/* Certificate Preview */}
                <div className="p-8" ref={certRef}>
                    <div className="bg-gradient-to-br from-slate-800 via-slate-850 to-slate-900 border-2 border-indigo-500/30 rounded-[2rem] p-12 text-center relative overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(99,102,241,0.1),transparent_50%)]"></div>

                        {/* Partner logo */}
                        {certificate.partner && (
                            <div className="flex justify-center mb-8">
                                <div className="flex items-center space-x-3 px-6 py-3 bg-slate-800/50 rounded-full border border-slate-700">
                                    <Building2 size={20} className="text-slate-400" />
                                    <span className="text-slate-300 font-medium">In partnership with {certificate.partner.name}</span>
                                </div>
                            </div>
                        )}

                        <p className="text-indigo-400 font-mono text-sm tracking-[0.3em] uppercase mb-4">Certificate of Completion</p>

                        <h1 className="text-5xl font-black text-white tracking-tight mb-8">
                            {certificate.courseName}
                        </h1>

                        <p className="text-slate-400 text-lg mb-2">This certifies that</p>
                        <p className="text-4xl font-bold text-white mb-8">{certificate.recipientName}</p>

                        <p className="text-slate-400 text-lg mb-6">has demonstrated proficiency in</p>

                        <div className="flex flex-wrap justify-center gap-3 mb-8">
                            {certificate.skills.map((skill, i) => (
                                <span
                                    key={i}
                                    className="px-4 py-2 bg-indigo-600/20 border border-indigo-500/30 rounded-full text-indigo-300 font-medium text-sm"
                                >
                                    {skill}
                                </span>
                            ))}
                        </div>

                        <div className="flex justify-center items-center space-x-8 mt-12 text-slate-500 text-sm">
                            <div>
                                <p className="text-xs uppercase tracking-widest mb-1">Issued</p>
                                <p className="text-white font-medium">{formatDate(certificate.issueDate)}</p>
                            </div>
                            <div className="w-px h-10 bg-slate-700"></div>
                            <div>
                                <p className="text-xs uppercase tracking-widest mb-1">Certificate ID</p>
                                <p className="text-white font-mono">{certificate.certificateNumber}</p>
                            </div>
                            <div className="w-px h-10 bg-slate-700"></div>
                            <div className="flex flex-col items-center">
                                <p className="text-xs uppercase tracking-widest mb-1">Verify</p>
                                <div className="p-2 bg-white rounded-lg">
                                    <QrCode size={32} className="text-slate-900" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="p-8 pt-0 flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={handleDownloadPDF}
                        disabled={downloading}
                        className="flex-1 flex items-center justify-center space-x-3 px-8 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold text-lg transition-all"
                    >
                        <Download size={22} />
                        <span>{downloading ? 'Generating...' : 'Download PDF'}</span>
                    </button>

                    <button
                        onClick={handleShareLinkedIn}
                        className="flex-1 flex items-center justify-center space-x-3 px-8 py-5 bg-[#0077B5] hover:bg-[#006699] text-white rounded-2xl font-bold text-lg transition-all"
                    >
                        <Linkedin size={22} />
                        <span>Share on LinkedIn</span>
                    </button>
                </div>

                {/* Verification notice */}
                <div className="px-8 pb-8">
                    <div className="flex items-center space-x-3 p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                        <CheckCircle size={20} className="text-green-400" />
                        <p className="text-green-300 text-sm">
                            This certificate can be verified at: <span className="font-mono text-green-400">{certificate.verificationUrl}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CertificateView;
