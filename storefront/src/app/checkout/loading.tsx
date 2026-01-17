
import Skeleton from "@/components/common/Skeleton";

export default function Loading() {
    return (
        <div style={{ backgroundColor: '#fff', minHeight: '100vh' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 24px' }}>
                {/* Title Skeleton */}
                <Skeleton width={200} height={40} style={{ marginBottom: '40px' }} />

                <div className="lg:!grid-cols-[1fr_420px]" style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '40px' }}>

                    {/* Left Column: Shipping Form Skeleton */}
                    <div>
                        {/* Address Selection Layout */}
                        <div style={{ marginBottom: '32px' }}>
                            <Skeleton width={150} height={24} style={{ marginBottom: '16px' }} />
                            <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                                <div style={{ border: '1px solid #e5e5e5', borderRadius: '12px', padding: '16px', height: '140px' }}>
                                    <Skeleton width="60%" height={20} style={{ marginBottom: '12px' }} />
                                    <Skeleton width="80%" height={16} style={{ marginBottom: '8px' }} />
                                    <Skeleton width="50%" height={16} />
                                </div>
                                <div style={{ border: '1px solid #e5e5e5', borderRadius: '12px', padding: '16px', height: '140px' }}>
                                    <Skeleton width="60%" height={20} style={{ marginBottom: '12px' }} />
                                    <Skeleton width="80%" height={16} />
                                </div>
                            </div>
                        </div>

                        {/* Form Fields Skeleton */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <Skeleton width={80} height={16} style={{ marginBottom: '8px' }} />
                                    <Skeleton width="100%" height={48} borderRadius="8px" />
                                </div>
                                <div>
                                    <Skeleton width={80} height={16} style={{ marginBottom: '8px' }} />
                                    <Skeleton width="100%" height={48} borderRadius="8px" />
                                </div>
                            </div>

                            <div>
                                <Skeleton width={120} height={16} style={{ marginBottom: '8px' }} />
                                <Skeleton width="100%" height={80} borderRadius="8px" />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                                <div>
                                    <Skeleton width={80} height={16} style={{ marginBottom: '8px' }} />
                                    <Skeleton width="100%" height={48} borderRadius="8px" />
                                </div>
                                <div>
                                    <Skeleton width={80} height={16} style={{ marginBottom: '8px' }} />
                                    <Skeleton width="100%" height={48} borderRadius="8px" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary Skeleton */}
                    <div>
                        <div style={{
                            backgroundColor: '#f8f8f8', borderRadius: '12px', padding: '32px',
                            border: '1px solid #e5e5e5', height: '600px'
                        }}>
                            <Skeleton width={150} height={28} style={{ marginBottom: '24px' }} />

                            {/* Order Items */}
                            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                                <Skeleton width={64} height={64} borderRadius="8px" />
                                <div style={{ flex: 1 }}>
                                    <Skeleton width="80%" height={16} style={{ marginBottom: '8px' }} />
                                    <Skeleton width="40%" height={14} />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '16px', marginBottom: '20px' }}>
                                <Skeleton width={64} height={64} borderRadius="8px" />
                                <div style={{ flex: 1 }}>
                                    <Skeleton width="80%" height={16} style={{ marginBottom: '8px' }} />
                                    <Skeleton width="40%" height={14} />
                                </div>
                            </div>

                            <div style={{ height: '1px', backgroundColor: '#e5e5e5', margin: '24px 0' }} />

                            {/* Totals */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <Skeleton width={60} height={16} />
                                <Skeleton width={40} height={16} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <Skeleton width={80} height={16} />
                                <Skeleton width={40} height={16} />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
                                <Skeleton width={50} height={20} />
                                <Skeleton width={80} height={24} />
                            </div>

                            <Skeleton width="100%" height={56} borderRadius="50px" style={{ marginTop: '32px' }} />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
