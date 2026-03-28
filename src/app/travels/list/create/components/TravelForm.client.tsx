'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useEffect, useState } from 'react';
import { Plus, Trash, Calendar, MapPin, Search, GripVertical } from 'lucide-react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import ImageUpload from './ImageUpload.client';
import { cn } from '@/lib/utils';
import { MAP_CONFIG } from '@/lib/constants';
import { TravelCreateRequest } from '@/service/travelsList/types';
import { uploadTravelImages, createTravel } from '@/service/travelsList/travelListService';

const MapView = dynamic(() => import('./MapView.client'), { ssr: false });

type Place = {
  id: string | number;
  title: string;
  location: string;
  memo?: string;
  lat?: number;
  lon?: number;
};

type ImageFile = {
  id: string;
  file: File;
  preview: string;
  uploaded?: boolean;
  url?: string;
};

export default function TravelForm() {
  const router = useRouter();
  const [places, setPlaces] = useState<Place[]>([]);
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 폼 상태
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [memo, setMemo] = useState('');
  const [companions, setCompanions] = useState('');

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);

  // 장소 검색
  useEffect(() => {
    if (!searchOpen) return;
    if (query.trim().length < MAP_CONFIG.SEARCH_MIN_LENGTH) {
      setResults([]);
      return;
    }

    const id = setTimeout(async () => {
      setLoading(true);
      try {
        const url = `${MAP_CONFIG.NOMINATIM_API_URL}/search?format=json&q=${encodeURIComponent(query)}&limit=${MAP_CONFIG.SEARCH_LIMIT}`;
        const res = await fetch(url, {
          headers: {
            'User-Agent': 'trace-map-app',
          },
        });
        const data = await res.json();
        const mapped = (data || []).map((d: any) => ({
          id: String(d.place_id || d.osm_id || d.lat + d.lon),
          title: String(d.display_name?.split(',')[0] || d.name || ''),
          location: String(d.display_name || ''),
          lat: parseFloat(d.lat),
          lon: parseFloat(d.lon),
        }));
        setResults(mapped);
      } catch (e) {
        console.error('Search error:', e);
        setResults([]);
      }
      setLoading(false);
    }, MAP_CONFIG.SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(id);
  }, [query, searchOpen]);

  const addPlaceFromResult = (r: Place) => {
    if (!places.some((p) => p.title === r.title)) {
      setPlaces((p) => [
        ...p,
        {
          id: Date.now() + '-' + r.id,
          title: r.title,
          location: r.location,
          memo: '',
          lat: r.lat,
          lon: r.lon,
        },
      ]);
    }
    setSearchOpen(false);
    setQuery('');
    setResults([]);
  };

  const updateMemo = (id: string | number, memo: string) => {
    setPlaces((p) => p.map((x) => (x.id === id ? { ...x, memo } : x)));
  };

  const removePlace = (id?: string | number) => {
    id && setPlaces((p) => p.filter((x) => x.id !== id));
  };

  // 드래그 앤 드롭
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    const newPlaces = [...places];
    const [draggedItem] = newPlaces.splice(draggedIndex, 1);

    if (draggedItem) {
      newPlaces.splice(dropIndex, 0, draggedItem);
      setPlaces(newPlaces);
    }

    setDraggedIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSubmit = async () => {
    // 유효성 검사
    if (!title.trim()) {
      alert('여행 제목을 입력해주세요.');
      return;
    }

    if (!startDate || !endDate) {
      alert('여행 날짜를 선택해주세요.');
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert('종료일은 시작일보다 이후여야 합니다.');
      return;
    }

    if (places.length === 0) {
      alert('최소 1개의 장소를 추가해주세요.');
      return;
    }

    // lat, lon이 없는 장소 체크
    const invalidPlaces = places.filter((p) => !p.lat || !p.lon);
    if (invalidPlaces.length > 0) {
      alert('일부 장소의 위치 정보가 없습니다. 장소를 다시 선택해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. 이미지 업로드
      let imageUrls: string[] = [];
      if (images.length > 0) {
        const uploadResult = await uploadTravelImages(images.map((img) => img.file));

        if (uploadResult.success && uploadResult.data) {
          imageUrls = uploadResult.data.urls;
        } else {
          throw new Error('이미지 업로드 실패');
        }
      }

      // 2. 여행 기록 저장
      const companionList = companions
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);

      const travelData: TravelCreateRequest = {
        title: title.trim(),
        startDate,
        endDate,
        memo: memo.trim() || undefined,
        companions: companionList.length > 0 ? companionList : undefined,
        tags: [], // 태그 기능 추가시
        places: places.map((place, index) => ({
          title: place.title,
          location: place.location,
          memo: place.memo,
          lat: place.lat!,
          lon: place.lon!,
          order: index,
        })),
        countryCode: 'KR',
        images: imageUrls.length > 0 ? imageUrls : undefined,
      };

      const result = await createTravel(travelData);

      if (result.success) {
        alert('여행 기록이 저장되었습니다!');
        router.push('/travels/list');
      } else {
        throw new Error(result.data.message || '저장 실패');
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert(error instanceof Error ? error.message : '저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* 상단 헤더는 Header 컴포넌트에서 처리 */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* 좌측 지도 영역 */}
        <div className="lg:col-span-2">
          <MapView places={places} />

          <div className="mt-6">
            <h4 className="mb-3 text-sm font-semibold text-neutral-400">다녀온 곳</h4>

            <div className="flex flex-col gap-3">
              {places.length > 0 ? (
                places.map((place, idx) => (
                  <Card
                    key={place.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, idx)}
                    onDragOver={(e) => handleDragOver(e, idx)}
                    onDrop={(e) => handleDrop(e, idx)}
                    onDragEnd={handleDragEnd}
                    className={cn(
                      'flex cursor-move flex-row items-center justify-between gap-4 p-3 transition-all',
                      draggedIndex === idx && 'scale-95 opacity-40'
                    )}
                  >
                    <div className="flex flex-1 items-center gap-3">
                      <div className="cursor-grab active:cursor-grabbing">
                        <GripVertical className="text-muted-foreground h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="leading-tight font-semibold">{place.title}</div>
                        {place.memo && (
                          <div className="text-muted-foreground mt-1 line-clamp-1 text-sm">
                            {place.memo}
                          </div>
                        )}
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 shrink-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        removePlace(place.id);
                      }}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </Card>
                ))
              ) : (
                <Card className="text-muted-foreground border-dashed p-8 text-center">
                  다녀온 장소가 없습니다. 장소를 추가해주세요.
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* 우측 폼 영역 */}
        <div className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title">여행 제목</Label>
            <Input
              id="title"
              placeholder="여행 제목을 입력하세요."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label>여행 날짜</Label>
            <div className="flex gap-2">
              <InputGroup>
                <InputGroupAddon align="inline-start">
                  <Calendar className="h-4 w-4" />
                </InputGroupAddon>
                <InputGroupInput
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  disabled={isSubmitting}
                />
              </InputGroup>

              <InputGroup>
                <InputGroupAddon align="inline-start">
                  <Calendar className="h-4 w-4" />
                </InputGroupAddon>
                <InputGroupInput
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  disabled={isSubmitting}
                />
              </InputGroup>
            </div>
          </div>

          {/* 장소 추가 */}
          <div className="space-y-2">
            <Label>장소</Label>
            <Popover open={searchOpen} onOpenChange={setSearchOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full" disabled={isSubmitting}>
                  <Plus className="mr-2 h-4 w-4" />
                  장소 추가하기
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-(--radix-popover-trigger-width) p-3" align="start">
                <div className="flex items-center gap-2">
                  <Search className="text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="장소를 검색하세요 (3자 이상)"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="border-0 shadow-none focus-visible:ring-0"
                  />
                </div>

                <div className="mt-3 max-h-60 space-y-1 overflow-auto">
                  {loading ? (
                    <div className="text-muted-foreground py-4 text-center text-sm">검색 중...</div>
                  ) : results.length > 0 ? (
                    results.map((r) => (
                      <Button
                        key={r.id}
                        variant="ghost"
                        className="h-auto w-full justify-start py-2"
                        onClick={() => addPlaceFromResult(r)}
                      >
                        <div className="bg-primary/10 mr-3 flex h-8 w-8 shrink-0 items-center justify-center rounded-md">
                          <MapPin className="text-primary h-4 w-4" />
                        </div>
                        <div className="min-w-0 flex-1 text-left">
                          <div className="truncate font-medium">{r.title}</div>
                          <div className="text-muted-foreground truncate text-xs">{r.location}</div>
                        </div>
                      </Button>
                    ))
                  ) : query.trim().length >= MAP_CONFIG.SEARCH_MIN_LENGTH ? (
                    <div className="text-muted-foreground py-4 text-center text-sm">
                      검색 결과가 없습니다.
                    </div>
                  ) : (
                    <div className="text-muted-foreground py-4 text-center text-sm">
                      {MAP_CONFIG.SEARCH_MIN_LENGTH}자 이상 입력하면 검색합니다.
                    </div>
                  )}
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* 선택된 장소 목록 */}
          {places.length > 0 && (
            <div className="space-y-2">
              <Label>선택된 장소</Label>
              <div className="space-y-2">
                {places.map((place) => (
                  <Card key={place.id} className="p-3">
                    <div className="mb-2 flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold">{place.title}</div>
                        <div className="text-muted-foreground truncate text-xs">
                          {place.location}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 shrink-0"
                        onClick={() => removePlace(place.id)}
                        disabled={isSubmitting}
                      >
                        <Trash className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <Input
                      value={place.memo || ''}
                      placeholder="메모를 입력하세요"
                      onChange={(e) => updateMemo(place.id, e.target.value)}
                      className="h-8 text-sm"
                      disabled={isSubmitting}
                    />
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="memo">메모</Label>
            <Textarea
              id="memo"
              placeholder="여행에 대한 간단한 메모를 작성해보세요."
              className="h-24 resize-none"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="companions">동행자</Label>
            <Input
              id="companions"
              placeholder="여행을 함께한 친구를 기록해보세요."
              value={companions}
              onChange={(e) => setCompanions(e.target.value)}
              disabled={isSubmitting}
            />
            <p className="text-muted-foreground text-xs">예: 김철수, 홍길동</p>
          </div>

          <div className="space-y-2">
            <Label>사진 추가 (선택)</Label>
            <ImageUpload images={images} onImagesChange={setImages} maxImages={10} />
          </div>

          <Button className="w-full" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? '저장 중...' : '저장하기'}
          </Button>
        </div>
      </div>
    </div>
  );
}
