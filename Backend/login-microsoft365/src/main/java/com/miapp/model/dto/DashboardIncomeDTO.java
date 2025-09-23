package com.miapp.model.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardIncomeDTO {
    private List<String> labels;
    private List<Long> biblioteca;
    private List<Long> computo;
}