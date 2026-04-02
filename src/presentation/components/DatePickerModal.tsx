import { AccessibleButton } from "@/presentation/components/AccessibleButton";
import { AccessibleText } from "@/presentation/components/AccessibleText";
import { useTheme } from "@/presentation/hooks/useTheme";
import { Spacing } from "@/presentation/theme/spacing";
import { formatDate } from "@/presentation/utils/format";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Modal,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onDateSelect: (date: string) => void;
  selectedDate?: string;
}

const MONTHS = [
  { value: 1, label: "Janeiro" },
  { value: 2, label: "Fevereiro" },
  { value: 3, label: "Março" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Maio" },
  { value: 6, label: "Junho" },
  { value: 7, label: "Julho" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Setembro" },
  { value: 10, label: "Outubro" },
  { value: 11, label: "Novembro" },
  { value: 12, label: "Dezembro" },
];

export function DatePickerModal({
  visible,
  onClose,
  onDateSelect,
  selectedDate,
}: DatePickerModalProps) {
  const { themeColors, isWeb } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const isWebMobile = isWeb && windowWidth < 640;

  const today = useMemo(() => new Date(), []);

  const parseDate = (dateStr?: string): Date => {
    if (!dateStr) return today;
    const separator = dateStr.includes("/") ? "/" : "-";
    const [day, month, year] = dateStr.split(separator).map(Number);
    return new Date(year, month - 1, day);
  };

  const initialDate = parseDate(selectedDate);
  const [day, setDay] = useState(initialDate.getDate());
  const [month, setMonth] = useState(initialDate.getMonth() + 1);
  const [year, setYear] = useState(initialDate.getFullYear());

  const dayListRef = useRef<FlatList>(null);
  const monthListRef = useRef<FlatList>(null);
  const yearListRef = useRef<FlatList>(null);

  const days = useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), []);
  const months = MONTHS;
  const startYear = useMemo(() => today.getFullYear() - 5, [today]);
  const endYear = useMemo(() => today.getFullYear() + 10, [today]);
  const years = useMemo(
    () =>
      Array.from({ length: endYear - startYear + 1 }, (_, i) => startYear + i),
    [startYear, endYear],
  );

  const maxDays = useMemo(
    () => new Date(year, month, 0).getDate(),
    [year, month],
  );

  const handleConfirm = () => {
    const formattedDate = new Date(year, month - 1, day);
    const dateString = formatDate(formattedDate);
    onDateSelect(dateString);
    onClose();
  };

  useEffect(() => {
    if (visible) {
      setTimeout(() => {
        try {
          dayListRef.current?.scrollToIndex({
            index: Math.max(0, day - 1),
            animated: false,
            viewPosition: 0.5,
          });
          monthListRef.current?.scrollToIndex({
            index: Math.max(0, month - 1),
            animated: false,
            viewPosition: 0.5,
          });
          yearListRef.current?.scrollToIndex({
            index: Math.max(0, year - startYear),
            animated: false,
            viewPosition: 0.5,
          });
        } catch (e) {
          console.warn("Erro ao fazer scroll do date picker", e);
        }
      }, 300);
    }
  }, [visible, day, month, year, startYear]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      accessibilityViewIsModal
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0,0,0,0.5)",
          padding: 20,
        }}
      >
        <View
          style={{
            backgroundColor: themeColors.background,
            borderRadius: 4,
            width: "100%",
            maxWidth: 500,
            paddingHorizontal: 20,
            paddingVertical: 20,
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: Spacing.medium,
            }}
          >
            <AccessibleText
              type="h2"
              style={{
                color: themeColors.text,
                fontSize: isWebMobile ? 18 : 20,
              }}
              accessibilityLabel="Selecionar data"
            >
              Selecionar data
            </AccessibleText>

            <TouchableOpacity
              onPress={onClose}
              accessible
              accessibilityRole="button"
              accessibilityLabel="Fechar"
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <Ionicons
                name="close"
                size={24}
                color={themeColors.icon}
                accessibilityElementsHidden
              />
            </TouchableOpacity>
          </View>

          {/* Date Selectors */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginBottom: Spacing.large,
              gap: 12,
            }}
          >
            {/* Days */}
            <View style={{ flex: 1, alignItems: "center" }}>
              <AccessibleText
                type="caption"
                style={{
                  color: themeColors.icon,
                  marginBottom: Spacing.small,
                  fontSize: isWebMobile ? 12 : 13,
                  fontWeight: "bold",
                }}
                accessibilityLabel="Dia"
              >
                Dia
              </AccessibleText>
              <FlatList
                ref={dayListRef}
                data={days}
                renderItem={({ item: dayNum }) => (
                  <TouchableOpacity
                    onPress={() => setDay(Math.min(dayNum, maxDays))}
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      backgroundColor:
                        day === dayNum ? themeColors.tint : "transparent",
                      borderRadius: 4,
                      marginVertical: 2,
                    }}
                    accessible
                    accessibilityRole="radio"
                    accessibilityState={{
                      selected: day === dayNum,
                    }}
                    accessibilityLabel={`Dia ${dayNum}`}
                  >
                    <AccessibleText
                      style={{
                        color:
                          day === dayNum
                            ? themeColors.buttonText
                            : themeColors.text,
                        textAlign: "center",
                        fontSize: isWebMobile ? 13 : 14,
                      }}
                    >
                      {String(dayNum).padStart(2, "0")}
                    </AccessibleText>
                  </TouchableOpacity>
                )}
                keyExtractor={(dayNum) => `day-${dayNum}`}
                style={{
                  height: 150,
                  borderWidth: 1,
                  borderColor: themeColors.icon + "30",
                  borderRadius: 4,
                  backgroundColor: themeColors.background,
                }}
                contentContainerStyle={{ paddingVertical: 12 }}
                scrollEnabled
                nestedScrollEnabled
                accessibilityLabel="Selecionar dia"
              />
            </View>

            {/* Months */}
            <View style={{ flex: 1.2, alignItems: "center" }}>
              <AccessibleText
                type="caption"
                style={{
                  color: themeColors.icon,
                  marginBottom: Spacing.small,
                  fontSize: isWebMobile ? 12 : 13,
                  fontWeight: "bold",
                }}
                accessibilityLabel="Mês"
              >
                Mês
              </AccessibleText>
              <FlatList
                ref={monthListRef}
                data={months}
                renderItem={({ item: monthItem }) => (
                  <TouchableOpacity
                    onPress={() => setMonth(monthItem.value)}
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      backgroundColor:
                        month === monthItem.value
                          ? themeColors.tint
                          : "transparent",
                      borderRadius: 4,
                      marginVertical: 2,
                    }}
                    accessible
                    accessibilityRole="radio"
                    accessibilityState={{
                      selected: month === monthItem.value,
                    }}
                    accessibilityLabel={monthItem.label}
                  >
                    <AccessibleText
                      style={{
                        color:
                          month === monthItem.value
                            ? themeColors.buttonText
                            : themeColors.text,
                        textAlign: "center",
                        fontSize: isWebMobile ? 12 : 13,
                      }}
                    >
                      {monthItem.label}
                    </AccessibleText>
                  </TouchableOpacity>
                )}
                keyExtractor={(monthItem) => `month-${monthItem.value}`}
                style={{
                  height: 150,
                  borderWidth: 1,
                  borderColor: themeColors.icon + "30",
                  borderRadius: 4,
                  backgroundColor: themeColors.background,
                }}
                contentContainerStyle={{ paddingVertical: 12 }}
                scrollEnabled
                nestedScrollEnabled
                accessibilityLabel="Selecionar mês"
              />
            </View>

            {/* Years */}
            <View style={{ flex: 1, alignItems: "center" }}>
              <AccessibleText
                type="caption"
                style={{
                  color: themeColors.icon,
                  marginBottom: Spacing.small,
                  fontSize: isWebMobile ? 12 : 13,
                  fontWeight: "bold",
                }}
                accessibilityLabel="Ano"
              >
                Ano
              </AccessibleText>
              <FlatList
                ref={yearListRef}
                data={years}
                renderItem={({ item: yearNum }) => (
                  <TouchableOpacity
                    onPress={() => setYear(yearNum)}
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      backgroundColor:
                        year === yearNum ? themeColors.tint : "transparent",
                      borderRadius: 4,
                      marginVertical: 2,
                    }}
                    accessible
                    accessibilityRole="radio"
                    accessibilityState={{
                      selected: year === yearNum,
                    }}
                    accessibilityLabel={`Ano ${yearNum}`}
                  >
                    <AccessibleText
                      style={{
                        color:
                          year === yearNum
                            ? themeColors.buttonText
                            : themeColors.text,
                        textAlign: "center",
                        fontSize: isWebMobile ? 13 : 14,
                      }}
                    >
                      {yearNum}
                    </AccessibleText>
                  </TouchableOpacity>
                )}
                keyExtractor={(yearNum) => `year-${yearNum}`}
                style={{
                  height: 150,
                  borderWidth: 1,
                  borderColor: themeColors.icon + "30",
                  borderRadius: 4,
                  backgroundColor: themeColors.background,
                }}
                contentContainerStyle={{ paddingVertical: 12 }}
                scrollEnabled
                nestedScrollEnabled
                accessibilityLabel="Selecionar ano"
              />
            </View>
          </View>

          {/* Preview */}
          <View
            style={{
              backgroundColor: themeColors.tint + "15",
              padding: 12,
              borderRadius: 4,
              marginBottom: Spacing.medium,
              alignItems: "center",
            }}
          >
            <AccessibleText
              style={{
                color: themeColors.text,
                fontSize: isWebMobile ? 16 : 18,
                fontWeight: "bold",
              }}
              accessibilityLabel={formatDate(new Date(year, month - 1, day))}
            >
              {String(day).padStart(2, "0")}/{String(month).padStart(2, "0")}/
              {year}
            </AccessibleText>
          </View>

          {/* Buttons */}
          <View
            style={{
              flexDirection: "row",
              gap: 12,
              justifyContent: "center",
            }}
          >
            <AccessibleButton
              title="Cancelar"
              onPress={onClose}
              accessibilityLabel="Cancelar seleção de data"
              style={{
                flex: 1,
                backgroundColor: themeColors.icon + "20",
                borderColor: "transparent",
              }}
            />
            <AccessibleButton
              title="Confirmar"
              onPress={handleConfirm}
              accessibilityLabel="Confirmar data selecionada"
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
