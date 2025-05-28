import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Axios from '../utils/Axios';
import SummaryApi from '../common/SummaryApi';
import {
  Box,
  CircularProgress,
  Grid,
  Paper,
  Typography,
  useTheme,
  LinearProgress,
  useMediaQuery,
  Divider,
  Card,
  CardContent,
  Skeleton
} from '@mui/material';
import CountUp from 'react-countup';

const StatCard = ({ icon, title, value, color, loading }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const getEmojiIcon = () => {
    switch (icon) {
      case 'total': return '📦';
      case 'processing': return '🔄';
      case 'cancelled': return '❌';
      case 'pending': return '⏳';
      case 'delivered': return '🚚';
      default: return '📊';
    }
  };

  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 3,
        boxShadow: theme.shadows[4],
        background: `linear-gradient(135deg, ${theme.palette[color].light}10, ${theme.palette[color].light}30)`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: theme.shadows[8]
        }
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" gap={2}>
          <Box
            sx={{
              backgroundColor: theme.palette[color].main,
              p: 2,
              borderRadius: '12px',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem'
            }}
          >
            {getEmojiIcon()}
          </Box>
          <Box>
            <Typography 
              variant="subtitle2" 
              color="text.secondary"
              sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
            >
              {title}
            </Typography>
            {loading ? (
              <Box width={100} height={32}>
                <Skeleton variant="text" width="100%" height="100%" />
              </Box>
            ) : (
              <Typography 
                variant="h5" 
                fontWeight="bold"
                sx={{ fontSize: isMobile ? '1.25rem' : '1.5rem' }}
              >
                <CountUp 
                  end={value || 0} 
                  duration={1.5} 
                  separator="," 
                  decimals={0}
                />
              </Typography>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

const ProgressMetric = ({ label, value, color, trend, loading }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const TrendIcon = trend === 'up' ? '📈' : '📉';
  const trendColor = trend === 'up' ? theme.palette.success.main : theme.palette.error.main;

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Box sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontSize: isMobile ? '0.75rem' : '0.875rem' }}
          >
            {label}
          </Typography>
          {!loading && (
            <Box display="flex" alignItems="center">
              <span 
                style={{ 
                  color: trendColor,
                  marginRight: 4,
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}
              >
                {TrendIcon}
              </span>
              <Typography 
                variant="body2" 
                fontWeight="bold"
                sx={{ 
                  color: trendColor,
                  fontSize: isMobile ? '0.75rem' : '0.875rem'
                }}
              >
                {value}%
              </Typography>
            </Box>
          )}
        </Box>
        {loading ? (
          <Skeleton variant="rounded" width="100%" height={8} />
        ) : (
          <LinearProgress
            variant="determinate"
            value={value}
            color={color}
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: theme.palette[color].light
            }}
          />
        )}
      </Box>
    </Grid>
  );
};

const StockDashboard = () => {
  const { id } = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await Axios(SummaryApi.getWarehouseById(id));
        if (res.data.success) {
          setStats(res.data.summary);
          setError(null);
        } else {
          setError(res.data.message || "Failed to load warehouse stats");
        }
      } catch (err) {
        setError(err.message || "Network error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchStats();
  }, [id]);

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="60vh"
        sx={{ p: isMobile ? 2 : 4 }}
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="60vh"
        sx={{ p: isMobile ? 2 : 4 }}
      >
        <Typography 
          color="error" 
          variant="h6" 
          align="center"
          sx={{ maxWidth: 600, mx: 'auto' }}
        >
          {error}
        </Typography>
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="60vh"
        sx={{ p: isMobile ? 2 : 4 }}
      >
        <Typography 
          variant="h6" 
          align="center"
          sx={{ maxWidth: 600, mx: 'auto' }}
        >
          No statistics available for this warehouse
        </Typography>
      </Box>
    );
  }

  const {
    totalOrders = 0,
    acceptedOrders = 0,
    cancelledOrders = 0,
    pendingOrders = 0,
    deliveredOrders = 0
  } = stats;

  const acceptanceRate = totalOrders > 0 ? Math.round((acceptedOrders / totalOrders) * 100) : 0;
  const cancellationRate = totalOrders > 0 ? Math.round((cancelledOrders / totalOrders) * 100) : 0;
  const fulfillmentRate = totalOrders > 0 ? Math.round((deliveredOrders / totalOrders) * 100) : 0;

  return (
    <Box sx={{ 
      p: isMobile ? 2 : 4, 
      maxWidth: 1400, 
      mx: 'auto',
      minHeight: 'calc(100vh - 64px)'
    }}>
      <Typography 
        variant={isMobile ? 'h5' : 'h4'} 
        fontWeight="bold" 
        gutterBottom
        sx={{ 
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}
      >
        <span style={{ fontSize: '1.5rem' }}>📊</span>
        Warehouse Analytics Dashboard
      </Typography>

      {/* Key Metrics */}
      <Grid container spacing={isMobile ? 2 : 3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard 
            icon="total" 
            title="Total Orders" 
            value={totalOrders} 
            color="primary" 
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard 
            icon="processing" 
            title="Processing" 
            value={acceptedOrders} 
            color="success" 
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard 
            icon="cancelled" 
            title="Cancelled" 
            value={cancelledOrders} 
            color="error" 
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard 
            icon="pending" 
            title="Pending" 
            value={pendingOrders} 
            color="warning" 
            loading={loading}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <StatCard 
            icon="delivered" 
            title="Delivered" 
            value={deliveredOrders} 
            color="info" 
            loading={loading}
          />
        </Grid>
      </Grid>

      {/* Performance Metrics */}
      <Card
        sx={{
          borderRadius: 3,
          boxShadow: theme.shadows[3],
          mb: 4,
          background: theme.palette.background.paper
        }}
      >
        <CardContent>
          <Typography 
            variant="h6" 
            fontWeight="bold" 
            gutterBottom
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              mb: 2
            }}
          >
            <span style={{ fontSize: '1.25rem' }}>📈</span>
            Performance Metrics
          </Typography>
          
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={2}>
            <ProgressMetric
              label="Processing Rate"
              value={acceptanceRate}
              color="success"
              trend="up"
              loading={loading}
            />
            <ProgressMetric
              label="Cancellation Rate"
              value={cancellationRate}
              color="error"
              trend="down"
              loading={loading}
            />
            <ProgressMetric
              label="Fulfillment Rate"
              value={fulfillmentRate}
              color="info"
              trend="up"
              loading={loading}
            />
          </Grid>
        </CardContent>
      </Card>

      {/* Additional Stats Section */}
      <Grid container spacing={isMobile ? 2 : 3}>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            {/* <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                <span style={{ marginRight: 8 }}>📋</span>
                Order Distribution
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box 
                sx={{ 
                  height: 300,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: theme.palette.grey[100],
                  borderRadius: 2
                }}
              >
                <Typography color="text.secondary">
                  Order Distribution Chart
                </Typography>
              </Box>
            </CardContent> */}
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card sx={{ borderRadius: 3, height: '100%' }}>
            {/* <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                <span style={{ marginRight: 8 }}>🔄</span>
                Recent Activity
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box 
                sx={{ 
                  height: 300,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: theme.palette.grey[100],
                  borderRadius: 2
                }}
              >
                <Typography color="text.secondary">
                  Recent Activity Log
                </Typography>
              </Box>
            </CardContent> */}
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StockDashboard;