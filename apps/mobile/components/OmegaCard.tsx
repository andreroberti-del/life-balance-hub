import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '../constants/theme';
import { Card } from './Card';
import { OmegaBrand } from '../types';

interface OmegaCardProps {
  brand: OmegaBrand;
  isUserBrand?: boolean;
  style?: ViewStyle;
}

export function OmegaCard({ brand, isUserBrand = false, style }: OmegaCardProps) {
  const improvement = Math.round(brand.improvementRate * 100);
  const maxRatio = Math.max(brand.avgRatioBefore, 20);

  const beforeWidth = (brand.avgRatioBefore / maxRatio) * 100;
  const afterWidth = (brand.avgRatioAfter / maxRatio) * 100;

  return (
    <Card
      variant={isUserBrand ? 'lime' : 'default'}
      style={[styles.container, style]}
    >
      <View style={styles.header}>
        <View style={styles.brandInfo}>
          <View style={styles.brandIcon}>
            <Text style={styles.brandIconText}>
              {brand.name.charAt(0).toUpperCase()}
            </Text>
          </View>
          <View>
            <View style={styles.nameRow}>
              <Text style={styles.brandName}>{brand.name}</Text>
              {isUserBrand && (
                <View style={styles.yourBadge}>
                  <Text style={styles.yourBadgeText}>YOUR</Text>
                </View>
              )}
            </View>
            <Text style={styles.dosage}>{brand.dosage}</Text>
          </View>
        </View>

        <Text style={styles.usersCount}>
          {brand.usersCount.toLocaleString()} users
        </Text>
      </View>

      <View style={styles.ratioSection}>
        <View style={styles.ratioRow}>
          <Text style={styles.ratioLabel}>Before</Text>
          <View style={styles.ratioBarTrack}>
            <View
              style={[
                styles.ratioBar,
                styles.ratioBarBefore,
                { width: `${beforeWidth}%` },
              ]}
            />
          </View>
          <Text style={styles.ratioValue}>
            {brand.avgRatioBefore.toFixed(1)}:1
          </Text>
        </View>

        <View style={styles.ratioRow}>
          <Text style={styles.ratioLabel}>After</Text>
          <View style={styles.ratioBarTrack}>
            <View
              style={[
                styles.ratioBar,
                styles.ratioBarAfter,
                { width: `${afterWidth}%` },
              ]}
            />
          </View>
          <Text style={[styles.ratioValue, { color: Colors.lime }]}>
            {brand.avgRatioAfter.toFixed(1)}:1
          </Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.improvementBg}>
          <View
            style={[styles.improvementFill, { width: `${improvement}%` }]}
          />
        </View>
        <Text style={styles.improvementText}>
          {improvement}% avg improvement
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  brandInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.white15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  brandIconText: {
    color: Colors.white90,
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandName: {
    color: Colors.white,
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
  },
  yourBadge: {
    backgroundColor: Colors.limeBg,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.xs,
    marginLeft: Spacing.sm,
  },
  yourBadgeText: {
    color: Colors.lime,
    fontSize: 9,
    fontWeight: FontWeight.bold,
    letterSpacing: 1,
  },
  dosage: {
    color: Colors.white50,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.regular,
    marginTop: 2,
  },
  usersCount: {
    color: Colors.white50,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
  ratioSection: {
    marginBottom: Spacing.lg,
  },
  ratioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  ratioLabel: {
    color: Colors.white50,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    width: 44,
  },
  ratioBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: Colors.white08,
    borderRadius: 4,
    marginHorizontal: Spacing.sm,
    overflow: 'hidden',
  },
  ratioBar: {
    height: '100%',
    borderRadius: 4,
  },
  ratioBarBefore: {
    backgroundColor: Colors.orange,
  },
  ratioBarAfter: {
    backgroundColor: Colors.lime,
  },
  ratioValue: {
    color: Colors.white70,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    width: 40,
    textAlign: 'right',
  },
  footer: {
    alignItems: 'center',
  },
  improvementBg: {
    width: '100%',
    height: 6,
    backgroundColor: Colors.white08,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
  },
  improvementFill: {
    height: '100%',
    backgroundColor: Colors.lime,
    borderRadius: 3,
  },
  improvementText: {
    color: Colors.white50,
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
});
