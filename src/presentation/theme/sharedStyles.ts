import { StyleSheet } from "react-native";
import { Spacing } from "./spacing";

export const MIN_TOUCH_TARGET_SIZE = 44;

export const sharedStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "stretch",
    justifyContent: "flex-start",
    padding: Spacing.large,
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loader: {
    justifyContent: "center",
    alignItems: "center",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: Spacing.small,
  },
  createButton: {
    height: 56,
    borderRadius: 12,
    paddingHorizontal: 40,
    minWidth: 250,
    maxWidth: 260,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryButton: {
    height: 56,
    borderRadius: 12,
    paddingHorizontal: 24,
    borderWidth: 1.5,
    minWidth: 250,
    maxWidth: 260,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  list: {
    paddingTop: Spacing.medium,
  },
  content: {
    flex: 1,
    padding: 32,
    gap: 16,
    overflow: "hidden",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.large,
    borderBottomWidth: 1,
  },
  /** Coluna do texto à esquerda de switches: ocupa espaço livre e permite quebra de linha. */
  preferenceLabelColumn: {
    flex: 1,
    marginRight: 14,
    minWidth: 0,
  },
  titleContainer: {
    paddingVertical: 0,
  },
  input: {
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 18,
    paddingHorizontal: 5,
    marginBottom: Spacing.large,
    fontSize: 20,
  },
  buttonLink: {
    marginTop: 15,
    paddingVertical: 15,
  },
  touchTargetMin: {
    minWidth: MIN_TOUCH_TARGET_SIZE,
    minHeight: MIN_TOUCH_TARGET_SIZE,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalCard: {
    padding: Spacing.large,
    borderRadius: 12,
    alignItems: "center",
    width: "90%",
  },
});
