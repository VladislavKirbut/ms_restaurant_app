package by.aresheg.restaurant.mapper;

import by.aresheg.restaurant.domain.model.role.Role;
import by.aresheg.restaurant.domain.model.dto.RoleDto;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.ReportingPolicy;

import java.util.Set;

@Mapper(
        componentModel = MappingConstants.ComponentModel.SPRING,
        unmappedTargetPolicy = ReportingPolicy.IGNORE
)
public interface RoleMapper {

    @Mapping(target = "id", ignore = true)
    Role toEntity(RoleDto roleDto);

    RoleDto toDto(Role role);

    Set<RoleDto> toDto(Set<Role> role);

}
