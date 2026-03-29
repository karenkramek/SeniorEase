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
    marginBottom: Spacing.medium,
    borderRadius: 40,
    paddingVertical: 22,
    paddingHorizontal: 40,
    minWidth: 260,
    alignSelf: "center",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
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
    alignItems: "flex-start",
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
    paddingVertical: Spacing.large,
    borderBottomWidth: 1,
  },
  input: {
    borderWidth: 2,
    borderRadius: 24,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginBottom: Spacing.large,
    fontSize: 20,
    backgroundColor: "#FFF",
    borderColor: "#1A237E",
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
