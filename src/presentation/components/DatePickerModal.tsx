import { AccessibleButton } from "@/presentation/components/AccessibleButton";
import { AccessibleText } from "@/presentation/components/AccessibleText";
import { useTheme } from "@/presentation/hooks/useTheme";
import { Spacing } from "@/presentation/theme/spacing";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
    Modal,
    ScrollView,
    TouchableOpacity,
    View,
    useWindowDimensions,
} from "react-native";

interface DatePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onDateSelect: (date: string) => void; // Format: "dd-mm-yyyy"
  selectedDate?: string; // Format: "dd-mm-yyyy"
}

export function DatePickerModal({
  visible,
  onClose,
  onDateSelect,
  selectedDate,
}: DatePickerModalProps) {
  const { themeColors, isWeb } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const isWebMobile = isWeb && windowWidth < 640;

  // Parse selected date or use today
  const today = new Date();
  const parseDate = (dateStr?: string) => {
    if (!dateStr) return today;
    const [day, month, year] = dateStr.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const initialDate = parseDate(selectedDate);
  const [selectedDay, setSelectedDay] = useState(initialDate.getDate());
  const [selectedMonth, setSelectedMonth] = useState(initialDate.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(initialDate.getFullYear());

  // Generate arrays for days, months, years
  const days = useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), []);

  const months = [
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

  const startYear = today.getFullYear() - 5;
  const endYear = today.getFullYear() + 10;
  const years = Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  );

  const handleConfirm = () => {
    const formattedDate = `${String(selectedDay).padStart(2, "0")}-${String(selectedMonth).padStart(2, "0")}-${selectedYear}`;
    onDateSelect(formattedDate);
    onClose();
  };

  // Get max days for selected month/year
  const maxDays = new Date(selectedYear, selectedMonth, 0).getDate();

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
                }}
                accessibilityLabel="Dia"
              >
                Dia
              </AccessibleText>
              <ScrollView
                style={{
                  height: 150,
                  borderWidth: 1,
                  borderColor: themeColors.icon + "30",
                  borderRadius: 4,
                  backgroundColor: themeColors.background,
                }}
                contentContainerStyle={{ paddingVertical: 12 }}
                accessibilityLabel="Selecionar dia"
              >
                {days.map((day) => (
                  <TouchableOpacity
                    key={day}
                    onPress={() => setSelectedDay(Math.min(day, maxDays))}
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      backgroundColor:
                        selectedDay === day ? themeColors.tint : "transparent",
                      borderRadius: 4,
                      marginVertical: 2,
                    }}
                    accessible
                    accessibilityRole="radio"
                    accessibilityState={{
                      selected: selectedDay === day,
                    }}
                    accessibilityLabel={`${day}`}
                  >
                    <AccessibleText
                      style={{
                        color:
                          selectedDay === day
                            ? themeColors.buttonText
                            : themeColors.text,
                        textAlign: "center",
                        fontSize: isWebMobile ? 13 : 14,
                      }}
                    >
                      {String(day).padStart(2, "0")}
                    </AccessibleText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Months */}
            <View style={{ flex: 1.2, alignItems: "center" }}>
              <AccessibleText
                type="caption"
                style={{
                  color: themeColors.icon,
                  marginBottom: Spacing.small,
                  fontSize: isWebMobile ? 12 : 13,
                }}
                accessibilityLabel="Mês"
              >
                Mês
              </AccessibleText>
              <ScrollView
                style={{
                  height: 150,
                  borderWidth: 1,
                  borderColor: themeColors.icon + "30",
                  borderRadius: 4,
                  backgroundColor: themeColors.background,
                }}
                contentContainerStyle={{ paddingVertical: 12 }}
                accessibilityLabel="Selecionar mês"
              >
                {months.map((month) => (
                  <TouchableOpacity
                    key={month.value}
                    onPress={() => setSelectedMonth(month.value)}
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      backgroundColor:
                        selectedMonth === month.value
                          ? themeColors.tint
                          : "transparent",
                      borderRadius: 4,
                      marginVertical: 2,
                    }}
                    accessible
                    accessibilityRole="radio"
                    accessibilityState={{
                      selected: selectedMonth === month.value,
                    }}
                    accessibilityLabel={month.label}
                  >
                    <AccessibleText
                      style={{
                        color:
                          selectedMonth === month.value
                            ? themeColors.buttonText
                            : themeColors.text,
                        textAlign: "center",
                        fontSize: isWebMobile ? 12 : 13,
                      }}
                    >
                      {month.label}
                    </AccessibleText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Years */}
            <View style={{ flex: 1, alignItems: "center" }}>
              <AccessibleText
                type="caption"
                style={{
                  color: themeColors.icon,
                  marginBottom: Spacing.small,
                  fontSize: isWebMobile ? 12 : 13,
                }}
                accessibilityLabel="Ano"
              >
                Ano
              </AccessibleText>
              <ScrollView
                style={{
                  height: 150,
                  borderWidth: 1,
                  borderColor: themeColors.icon + "30",
                  borderRadius: 4,
                  backgroundColor: themeColors.background,
                }}
                contentContainerStyle={{ paddingVertical: 12 }}
                accessibilityLabel="Selecionar ano"
              >
                {years.map((year) => (
                  <TouchableOpacity
                    key={year}
                    onPress={() => setSelectedYear(year)}
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      backgroundColor:
                        selectedYear === year ? themeColors.tint : "transparent",
                      borderRadius: 4,
                      marginVertical: 2,
                    }}
                    accessible
                    accessibilityRole="radio"
                    accessibilityState={{
                      selected: selectedYear === year,
                    }}
                    accessibilityLabel={`${year}`}
                  >
                    <AccessibleText
                      style={{
                        color:
                          selectedYear === year
                            ? themeColors.buttonText
                            : themeColors.text,
                        textAlign: "center",
                        fontSize: isWebMobile ? 13 : 14,
                      }}
                    >
                      {year}
                    </AccessibleText>
                  </TouchableOpacity>
                ))}
              </ScrollView>
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
              accessibilityLabel={`Data selecionada: ${String(selectedDay).padStart(2, "0")}-${String(selectedMonth).padStart(2, "0")}-${selectedYear}`}
            >
              {String(selectedDay).padStart(2, "0")}/
              {String(selectedMonth).padStart(2, "0")}/{selectedYear}
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
