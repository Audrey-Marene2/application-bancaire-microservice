// ==========================================
// STYLES MANQUANTS pour TransferScreen.js
// ==========================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: 'center',
    padding: 24,
    paddingTop: 40,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  accountCard: {
    marginBottom: 12,
  },
  accountCardSelected: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  accountCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  accountDetails: {
    marginLeft: 12,
    flex: 1,
  },
  accountType: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  selectedText: {
    color: COLORS.primary,
  },
  accountBalance: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  transferIcon: {
    alignItems: 'center',
    marginVertical: 16,
  },
  emptyCard: {
    padding: 20,
  },
  emptyText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  previewCard: {
    marginTop: 16,
    backgroundColor: COLORS.surface,
  },
  previewLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 12,
  },
  previewSection: {
    marginBottom: 12,
  },
  previewSubtitle: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  previewText: {
    fontSize: 14,
    color: COLORS.text,
  },
  previewAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewDetail: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.divider,
    marginVertical: 12,
  },
  actions: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  button: {
    flex: 1,
  },
  infoCard: {
    backgroundColor: COLORS.info + '10',
    marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: COLORS.text,
  },
  previewTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
  },
});